from pathlib import Path
from typing import Any, Optional
from zipfile import BadZipFile

import pandas as pd
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pandas.errors import EmptyDataError, ParserError

from app.config import settings
from app.schema_extraction import extract_schema


SUPPORTED_FILE_EXTENSIONS = {".csv", ".xlsx", ".xls", ".json"}


def validate_dataset_upload(file: Optional[UploadFile]) -> UploadFile:
    if file is None or not file.filename:
        raise HTTPException(status_code=400, detail="Dataset file is required.")

    file_extension = Path(file.filename).suffix.lower()
    if file_extension not in SUPPORTED_FILE_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Upload CSV, Excel, or JSON.",
        )

    return file


def read_uploaded_dataset(uploaded_file: UploadFile) -> pd.DataFrame:
    file_extension = Path(uploaded_file.filename or "").suffix.lower()

    if file_extension == ".csv":
        return pd.read_csv(uploaded_file.file)

    if file_extension in {".xlsx", ".xls"}:
        return pd.read_excel(uploaded_file.file)

    if file_extension == ".json":
        return pd.read_json(uploaded_file.file)

    raise HTTPException(
        status_code=400,
        detail="Unsupported file type. Upload CSV, Excel, or JSON.",
    )


def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name, version="0.1.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health")
    def health_check() -> dict[str, str]:
        return {
            "status": "ok",
            "service": settings.app_name,
            "environment": settings.environment,
        }

    @app.post("/upload")
    async def upload_dataset(
        file: Optional[UploadFile] = File(default=None),
    ) -> dict[str, Any]:
        uploaded_file = validate_dataset_upload(file)
        filename = uploaded_file.filename or "uploaded"

        try:
            dataframe = read_uploaded_dataset(uploaded_file)
        except EmptyDataError as exc:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty.",
            ) from exc
        except ParserError as exc:
            raise HTTPException(
                status_code=400,
                detail="Could not parse uploaded file.",
            ) from exc
        except (BadZipFile, ValueError) as exc:
            raise HTTPException(
                status_code=400,
                detail="Could not read uploaded file. Please check the file format.",
            ) from exc
        except UnicodeDecodeError as exc:
            raise HTTPException(
                status_code=400,
                detail="Could not decode uploaded file. Please upload a UTF-8 file.",
            ) from exc
        finally:
            await uploaded_file.close()

        return extract_schema(dataframe, filename)

    return app


app = create_app()
