export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50 py-10">
      <div className="container-custom">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-wood-800">کوکي ها</h1>
          <p className="text-gray-600 mt-3">
            براي بهبود تجربه کاربري، نمايش محتواي شخصي سازي شده و امنيت،
            از کوکي ها استفاده مي کنيم. با ادامه استفاده از سايت، با اين موضوع موافقت مي کنيد.
          </p>
          <div className="mt-6 space-y-3 text-sm text-gray-600">
            <p>کوکي هاي ضروري: براي اجراي درست سايت.</p>
            <p>کوکي هاي عملکردي: براي ذخيره تنظيمات و تجربه بهتر.</p>
            <p>کوکي هاي تحليلي: براي بهبود خدمات.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
