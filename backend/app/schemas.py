from pydantic import BaseModel, Field
from typing import Literal

class ChatRequest(BaseModel):
    document_ids: list[str] = Field(min_length=1)
    question: str = Field(min_length=1, max_length=5000)

class SummaryRequest(BaseModel):
    document_id: str
    length: Literal["short", "medium", "detailed"] = "medium"

class ExtractRequest(BaseModel):
    document_id: str
