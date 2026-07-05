from typing import Any


def _get_value(item: Any, field: str, default: Any = None) -> Any:
    if isinstance(item, dict):
        return item.get(field, default)
    return getattr(item, field, default)


def _cf_combine(old: float, new: float) -> float:
    return old + new * (1 - old)


def process_consultation(
    answers: list[dict[str, Any]],
    rules: list[Any],
    recommendations: list[Any],
    symptoms: list[Any],
) -> dict[str, Any]:
    """Menghasilkan rekomendasi dinamis dari jawaban pengguna."""
    cf_by_symptom = {
        str(answer["symptom_code"]): float(answer["cf_user"])
        for answer in answers
        if float(answer.get("cf_user", 0)) > 0
    }

    active_symptoms = {
        _get_value(symptom, "code"): _get_value(symptom, "name")
        for symptom in symptoms
        if _get_value(symptom, "status") == "aktif"
    }
    active_recommendations = {
        _get_value(recommendation, "code"): _get_value(recommendation, "name")
        for recommendation in recommendations
        if _get_value(recommendation, "status") == "aktif"
    }

    active_rules: list[str] = []
    combined_cf: dict[str, float] = {}
    reasons: dict[str, set[str]] = {}

    for rule in rules:
        if _get_value(rule, "status") != "aktif":
            continue

        symptom_codes = list(_get_value(rule, "symptom_codes", []))
        recommendation_code = _get_value(rule, "recommendation_code")

        if recommendation_code not in active_recommendations:
            continue

        # Forward Chaining: rule aktif jika SEMUA gejala rule dipilih user.
        has_all_symptoms = all(
            code in active_symptoms and code in cf_by_symptom for code in symptom_codes
        )
        if not has_all_symptoms:
            continue

        active_rules.append(_get_value(rule, "code"))

        # CF premis untuk relasi AND adalah nilai keyakinan user yang paling kecil.
        cf_premis = min(cf_by_symptom[code] for code in symptom_codes)

        # CF rule mengalikan keyakinan user dengan keyakinan pakar.
        cf_rule = cf_premis * float(_get_value(rule, "cf_pakar"))

        # Jika beberapa rule menuju rekomendasi sama, kombinasikan CF positif.
        combined_cf[recommendation_code] = _cf_combine(
            combined_cf.get(recommendation_code, 0.0),
            cf_rule,
        )
        reasons.setdefault(recommendation_code, set()).update(
            active_symptoms[code] for code in symptom_codes
        )

    results = [
        {
            "recommendation_code": recommendation_code,
            "recommendation": active_recommendations[recommendation_code],
            "cf_value": round(cf_value, 4),
            "percentage": round(cf_value * 100),
            "reason": ", ".join(sorted(reasons[recommendation_code])),
        }
        for recommendation_code, cf_value in combined_cf.items()
    ]
    results.sort(key=lambda item: item["cf_value"], reverse=True)

    return {"results": results, "active_rules": active_rules}
