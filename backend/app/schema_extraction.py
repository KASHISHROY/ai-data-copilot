from typing import Any

import pandas as pd


def extract_schema(dataframe: pd.DataFrame, filename: str) -> dict[str, Any]:
    """Create a JSON-safe schema summary from an uploaded dataset."""

    normalized_dataframe = dataframe.copy()
    normalized_dataframe.columns = [
        str(column) for column in normalized_dataframe.columns
    ]

    sample_rows = normalized_dataframe.head(5).astype(object)
    sample_rows = sample_rows.where(pd.notna(sample_rows), None)

    return {
        "filename": filename,
        "columns": list(normalized_dataframe.columns),
        "data_types": {
            str(column): str(dtype)
            for column, dtype in normalized_dataframe.dtypes.items()
        },
        "row_count": int(normalized_dataframe.shape[0]),
        "column_count": int(normalized_dataframe.shape[1]),
        "sample_rows": sample_rows.to_dict(orient="records"),
    }
