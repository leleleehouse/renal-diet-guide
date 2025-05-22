from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from app.recommend import recommend_meal
from app.data.retrieval_rag import retriever, qa
from fastapi.responses import JSONResponse
from typing import List, Dict, Any

app = FastAPI(
    title="신장투석 환자 식이 추천 API",
    description="신장투석 환자의 개인정보를 바탕으로 맞춤형 식이 추천과 조언을 제공하는 API입니다.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Comorbidities(BaseModel):
    diabetes: bool
    hypertension: bool

class PatientInfo(BaseModel):
    age: int
    gender: str
    height: float
    weight: float
    dialysisType: str
    urineOutput: str
    comorbidities: Comorbidities
    dialysis_frequency: int = 3  # 기본값 3회/주

class NutritionTotal(BaseModel):
    kcal: float
    protein: float
    sodium: float
    potassium: float
    phosphorus: float

class RecommendationResponse(BaseModel):
    foods: List[str]
    nutrition_total: NutritionTotal
    rag_advice: str

class ChatMessage(BaseModel):
    message: str
    patient_info: PatientInfo

@app.post("/recommend", response_model=RecommendationResponse)
async def recommend(info: PatientInfo):
    """
    환자 정보를 바탕으로 맞춤형 식이 추천과 조언을 제공합니다.
    
    - **foods**: 추천 음식 목록
    - **nutrition_total**: 영양소 총량
    - **rag_advice**: RAG 기반 맞춤형 식이 조언
    """
    try:
        info_dict = info.dict()
        print("[DEBUG] 받은 info:", info_dict)
        result = recommend_meal(info_dict, retriever=retriever)
        print("[DEBUG] 반환:", result)
        return result
    except Exception as e:
        print("[ERROR]", e)
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/chat")
async def chat(chat_data: ChatMessage):
    """
    환자의 질문에 대해 RAG 기반으로 답변을 제공합니다.
    """
    try:
        # 환자 정보를 포함한 컨텍스트 생성
        context = f"""
        환자 정보:
        - 나이: {chat_data.patient_info.age}세
        - 성별: {chat_data.patient_info.gender}
        - 투석 유형: {chat_data.patient_info.dialysisType}
        - 소변량: {chat_data.patient_info.urineOutput}
        - 동반질환: {', '.join([k for k, v in chat_data.patient_info.comorbidities.dict().items() if v])}
        - 투석 주기: {chat_data.patient_info.dialysis_frequency}회/주
        """
        
        # RAG 쿼리 실행
        result = qa.invoke({
            "query": f"{context}\n\n질문: {chat_data.message}"
        })
        
        return {"response": result.get("result", "죄송합니다. 답변을 생성하지 못했습니다.")}
    except Exception as e:
        print("[ERROR]", e)
        return JSONResponse(status_code=500, content={"error": str(e)})
