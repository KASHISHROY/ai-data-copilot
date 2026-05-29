from datetime import date, datetime
from typing import Any

import pandas as pd


def to_json_safe_value(value: Any) -> Any:
    if value is None:
        return None

    if pd.api.types.is_scalar(value) and pd.isna(value):
        return None

    if isinstance(value, (datetime, date)):
        return value.isoformat()

    if hasattr(value, "item"):
        return value.item()

    return value


def extract_schema(dataframe: pd.DataFrame, filename: str) -> dict[str, Any]:
    """Create a JSON-safe schema summary from an uploaded dataset."""

    normalized_dataframe = dataframe.copy()
    normalized_dataframe.columns = [
        str(column) for column in normalized_dataframe.columns
    ]

    sample_rows = normalized_dataframe.head(5).astype(object)
    sample_rows = sample_rows.where(pd.notna(sample_rows), None)
    sample_records = [
        {
            str(column): to_json_safe_value(value)
            for column, value in row.items()
        }
        for row in sample_rows.to_dict(orient="records")
    ]

    return {
        "filename": filename,
        "columns": list(normalized_dataframe.columns),
        "data_types": {
            str(column): str(dtype)
            for column, dtype in normalized_dataframe.dtypes.items()
        },
        "row_count": int(normalized_dataframe.shape[0]),
        "column_count": int(normalized_dataframe.shape[1]),
        "sample_rows": sample_records,
    }
