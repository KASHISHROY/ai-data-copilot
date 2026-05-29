from pathlib import Path
from typing import Any, Optional

import pandas as pd
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pandas.errors import EmptyDataError, ParserError

from app.config import settings
from app.schema_extraction import extract_schema


def validate_csv_upload(file: Optional[UploadFile]) -> UploadFile:
    if file is None or not file.filename:
        raise HTTPException(status_code=400, detail="CSV file is required.")

    file_extension = Path(file.filename).suffix.lower()
    if file_extension != ".csv":
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are supported right now.",
        )

    return file


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
        uploaded_file = validate_csv_upload(file)
        filename = uploaded_file.filename or "uploaded.csv"

        try:
            dataframe = pd.read_csv(uploaded_file.file)
        except EmptyDataError as exc:
            raise HTTPException(
                status_code=400,
                detail="Uploaded CSV file is empty.",
            ) from exc
        except ParserError as exc:
            raise HTTPException(
                status_code=400,
                detail="Could not parse CSV file.",
            ) from exc
        except UnicodeDecodeError as exc:
            raise HTTPException(
                status_code=400,
                detail="Could not decode CSV file. Please upload a UTF-8 CSV.",
            ) from exc
        finally:
            await uploaded_file.close()

        return extract_schema(dataframe, filename)

    return app


app = create_app()
