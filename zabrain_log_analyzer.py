def predict_next_failure(df):
    if df.empty:
        return

    hourly = df.groupby("Hour").size()

    # حساب المتوسط والانحراف
    mean = hourly.mean()
    std = hourly.std()

    # تحديد الساعات الخطرة
    risky_hours = hourly[hourly > mean + std].index.tolist()

    print("🤖 التوقع:")
    if risky_hours:
        print("⚠️ ساعات متوقع فيها فشل عالي:", risky_hours)
    else:
        print("✅ لا يوجد نمط خطر واضح")
