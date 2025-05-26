import os
import json
import itertools
from app.logic.nutrition_target import get_targets
from app.data.retrieval_rag import qa
import random
import requests

def load_food_items():
    file_path = os.path.join(os.path.dirname(__file__), "data", "parsed_food_db.json")
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)
def download_and_load_food_items() -> list[dict]:
    url = "https://huggingface.co/datasets/leleleehouse/renal-food-db/raw/main/parsed_food_db.json"
    local_path = "/tmp/parsed_food_db.json"

    if not os.path.exists(local_path):
        print("[INFO] .json 파일 다운로드 중...")
        response = requests.get(url)
        response.raise_for_status()
        with open(local_path, "wb") as f:
            f.write(response.content)
        print("[INFO] 다운로드 완료:", local_path)
    else:
        print("[INFO] 캐시된 파일 사용:", local_path)

    with open(local_path, "r", encoding="utf-8") as f:
        return json.load(f)
def score(meal_list, targets):
    total = {
        "kcal": 0,
        "protein": 0,
        "sodium": 0,
        "potassium": 0,
        "phosphorus": 0,
    }
    for item in meal_list:
        n = item["nutrition"]
        for k in total:
            total[k] += n.get(k, 0)
    return sum([
        abs(total["kcal"] - targets["kcal"]) / 100,
        abs(total["protein"] - targets["protein"]) / 5,
        abs(total["sodium"] - targets["sodium"]) / 200,
        abs(total["potassium"] - targets["potassium"]) / 200,
        abs(total["phosphorus"] - targets["phosphorus"]) / 100,
    ])

def recommend_meal(info: dict, retriever=None):
    print("[DEBUG] recommend_meal 진입")
    print("[DEBUG] info:", info)

    try:
        targets = get_targets(info)
        print("[DEBUG] targets:", targets)
    except Exception as e:
        print("[ERROR] 타겟 계산 실패:", e)
        raise
    
    food_items = download_and_load_food_items()
    # RAG를 통한 식이 조언 획득
    rag_query = f"""
    나는 {info.get('age', '알 수 없음')}세 {info.get('gender', '알 수 없음')}성 신장투석 환자입니다.
    투석 유형: {info.get('dialysisType', '알 수 없음')}
    소변량: {info.get('urineOutput', '알 수 없음')}
    동반질환: {', '.join([k for k, v in info.get('comorbidities', {}).items() if v])}
    키: {info.get('height', '알 수 없음')}cm, 체중: {info.get('weight', '알 수 없음')}kg입니다.
    투석 주기: {info.get('dialysis_frequency', '알 수 없음')}회/주
    현재 식사 관리에 어려움을 겪고 있습니다.
    제 상황에 맞는 식사 추천과 주의사항을 알려주세요.
    """
    
    rag_result = qa.invoke({"query": rag_query})
    print("[DEBUG] RAG 결과:", rag_result)

    # 음식 추천 로직
    if retriever is not None:
        query = f"{info['dialysisType']} {info['urineOutput']} {'당뇨' if info['comorbidities'].get('diabetes') else ''} {'고혈압' if info['comorbidities'].get('hypertension') else ''}"
        docs = retriever.invoke(query)
        retrieved_items = []
        for doc in docs:
            try:
                # JSON 형식이 아닌 경우를 처리
                if isinstance(doc.page_content, str):
                    try:
                        item = json.loads(doc.page_content)
                        if "name" in item and "nutrition" in item:
                            retrieved_items.append(item)
                    except json.JSONDecodeError:
                        # JSON이 아닌 경우 해당 문서 건너뛰기
                        continue
            except Exception as e:
                print(f"[WARNING] 문서 처리 중 오류 발생: {e}")
                continue
        
        if retrieved_items:
            sampled_items = retrieved_items
            print(f"[DEBUG] 리트리버 검색 결과: {len(sampled_items)}개")
        else:
            print("[WARNING] 리트리버 결과가 없어 랜덤 샘플링으로 대체")
            sampled_items = random.sample(food_items, 100)
    else:
        sampled_items = random.sample(food_items, 100)
        print(f"[DEBUG] 랜덤 샘플링: {len(sampled_items)}개")

    if len(sampled_items) < 3:
        return {
            "foods": [],
            "nutrition_total": {k: 0 for k in targets},
            "rag_advice": rag_result.get("result", "추천 정보를 찾을 수 없습니다.")
        }

    candidates = list(itertools.combinations(sampled_items, 3))
    best_meal = sorted(candidates, key=lambda x: score(x, targets))[0]

    result = {
        "foods": [item["name"] for item in best_meal],
        "nutrition_total": {
            k: sum(item["nutrition"].get(k, 0) for item in best_meal)
            for k in ["kcal", "protein", "sodium", "potassium", "phosphorus"]
        },
        "rag_advice": rag_result.get("result", "추천 정보를 찾을 수 없습니다.")
    }
    print("[DEBUG] 추천 결과:", result)
    return result

