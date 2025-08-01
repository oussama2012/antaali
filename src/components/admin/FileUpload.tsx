import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';

const FileUpload: React.FC = () => {
  const [uploadStatus, setUploadStatus] = useState<{
    [key: string]: 'idle' | 'uploading' | 'success' | 'error'
  }>({});
  const [uploadResults, setUploadResults] = useState<{
    [key: string]: { processed: number; errors: string[] }
  }>({});

  const fileTypes = [
    { key: '30ml', label: 'عطور 30ml', fileName: 'parfums_30ml.xlsx' },
    { key: '50ml', label: 'عطور 50ml', fileName: 'parfums_50ml.xlsx' },
    { key: '100ml', label: 'عطور 100ml', fileName: 'parfums_100ml.xlsx' }
  ];

  const handleFileUpload = async (fileType: string, file: File) => {
    setUploadStatus(prev => ({ ...prev, [fileType]: 'uploading' }));
    
    // محاكاة معالجة الملف
    setTimeout(() => {
      // في التطبيق الحقيقي، هنا سيتم قراءة ملف Excel وتحديث قاعدة البيانات
      const mockResult = {
        processed: Math.floor(Math.random() * 50) + 10,
        errors: Math.random() > 0.7 ? ['خطأ في الصف 5: اسم العطر مفقود'] : []
      };
      
      setUploadResults(prev => ({ ...prev, [fileType]: mockResult }));
      setUploadStatus(prev => ({ 
        ...prev, 
        [fileType]: mockResult.errors.length > 0 ? 'error' : 'success' 
      }));
    }, 2000);
  };

  const downloadTemplate = (fileType: string) => {
    // إنشاء ملف CSV نموذجي
    const headers = ['اسم العطر', 'الماركة', 'الكمية', 'الحد الأدنى'];
    const sampleData = [
      ['عود ملكي', 'Antaali', '50', '10'],
      ['ورد دمشقي', 'Antaali', '30', '10'],
      ['مسك أبيض', 'Antaali', '25', '8']
    ];
    
    const csvContent = [headers, ...sampleData]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template_parfums_${fileType}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Upload className="w-6 h-6 text-amber-600 ml-2" />
            رفع ملفات العطور
          </h2>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">تعليمات الرفع:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• يجب أن يحتوي الملف على الأعمدة التالية: اسم العطر، الماركة، الكمية، الحد الأدنى</li>
            <li>• الصيغ المدعومة: Excel (.xlsx) أو CSV</li>
            <li>• يمكنك تحميل نموذج لكل حجم من الأزرار أدناه</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fileTypes.map((type) => (
            <div key={type.key} className="border border-gray-200 rounded-lg p-6">
              <div className="text-center mb-4">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <h3 className="text-lg font-medium text-gray-800">{type.label}</h3>
                <p className="text-sm text-gray-500">{type.fileName}</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => downloadTemplate(type.key)}
                  className="w-full flex items-center justify-center space-x-2 space-x-reverse px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>تحميل النموذج</span>
                </button>

                <div className="relative">
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(type.key, file);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploadStatus[type.key] === 'uploading'}
                  />
                  <button
                    className={`w-full flex items-center justify-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-colors ${
                      uploadStatus[type.key] === 'uploading'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-amber-600 text-white hover:bg-amber-700'
                    }`}
                    disabled={uploadStatus[type.key] === 'uploading'}
                  >
                    <Upload className="w-4 h-4" />
                    <span>
                      {uploadStatus[type.key] === 'uploading' ? 'جاري الرفع...' : 'رفع الملف'}
                    </span>
                  </button>
                </div>

                {/* Upload Status */}
                {uploadStatus[type.key] && uploadStatus[type.key] !== 'idle' && (
                  <div className="mt-3">
                    {uploadStatus[type.key] === 'uploading' && (
                      <div className="flex items-center space-x-2 space-x-reverse text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm">جاري المعالجة...</span>
                      </div>
                    )}

                    {uploadStatus[type.key] === 'success' && uploadResults[type.key] && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 space-x-reverse text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">تم الرفع بنجاح</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          تم معالجة {uploadResults[type.key].processed} منتج
                        </div>
                      </div>
                    )}

                    {uploadStatus[type.key] === 'error' && uploadResults[type.key] && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 space-x-reverse text-red-600">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm">تم الرفع مع أخطاء</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          تم معالجة {uploadResults[type.key].processed} منتج
                        </div>
                        {uploadResults[type.key].errors.length > 0 && (
                          <div className="text-xs text-red-600">
                            <div className="font-medium">الأخطاء:</div>
                            {uploadResults[type.key].errors.map((error, index) => (
                              <div key={index}>• {error}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Upload History */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">سجل الرفع الأخير</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>آخر رفع لعطور 30ml:</span>
                <span>15 يناير 2024 - 10:30 ص</span>
              </div>
              <div className="flex justify-between">
                <span>آخر رفع لعطور 50ml:</span>
                <span>14 يناير 2024 - 2:15 م</span>
              </div>
              <div className="flex justify-between">
                <span>آخر رفع لعطور 100ml:</span>
                <span>13 يناير 2024 - 9:45 ص</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;