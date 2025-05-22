
def get_targets(info: dict) -> dict:
    weight = float(info["weight"])
    age = int(info["age"])
    urine = info["urineOutput"]

    # 단백질: 1.2 g/kg
    protein = weight * 1.2

    # 열량: 30~35 kcal/kg → 나이 기준 조정
    kcal = weight * (35 if age < 60 else 30)

    # 나트륨: 2000 mg 이하
    sodium = 2000

    # 칼륨: 소변 거의 없으면 2000 mg 이하
    potassium = 2000 if urine == "none" else 3000

    # 인: 800~1000 mg
    phosphorus = 1000

    return {
        "kcal": kcal,
        "protein": protein,
        "sodium": sodium,
        "potassium": potassium,
        "phosphorus": phosphorus
    }
