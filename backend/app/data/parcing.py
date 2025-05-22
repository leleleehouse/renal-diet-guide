import csv
import json

# 파일 경로
csv_path = "backend/app/data/20250408_음식DB.csv"  

# 추출할 열 이름 (필요 시 수정)
target_columns = {
    "식품명": "name",
    "에너지(kcal)": "kcal",
    "단백질(g)": "protein",
    "나트륨(mg)": "sodium",
    "칼륨(mg)": "potassium",
    "인(mg)": "phosphorus"
}

# 결과 저장 리스트
food_items = []

# 파일 열기
with open(csv_path, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    
    for row in reader:
        # 변환된 딕셔너리 구성
        item = {
            "name": row["식품명"],
            "nutrition": {
                "kcal": float(row["에너지(kcal)"] or 0),
                "protein": float(row["단백질(g)"] or 0),
                "sodium": float(row["나트륨(mg)"] or 0),
                "potassium": float(row["칼륨(mg)"] or 0),
                "phosphorus": float(row["인(mg)"] or 0)
            }
        }
        food_items.append(item)

# 예시 출력
for item in food_items[:5]:
    print(item)



with open("backend/app/data/parsed_food_db.json", "w", encoding="utf-8") as f:
    json.dump(food_items, f, ensure_ascii=False, indent=2)
