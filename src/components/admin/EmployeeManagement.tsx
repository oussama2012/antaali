import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2, UserCheck, UserX, Calendar } from 'lucide-react';
import { mockEmployees } from '../../data/mockData';
import { Employee, Attendance } from '../../types';

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [attendanceView, setAttendanceView] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    salary: 0,
    hireDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEmployee) {
      // تحديث موظف موجود
      setEmployees(prev => prev.map(emp => 
        emp.id === editingEmployee.id 
          ? { ...emp, ...formData }
          : emp
      ));
      setEditingEmployee(null);
    } else {
      // إضافة موظف جديد
      const newEmployee: Employee = {
        id: Date.now().toString(),
        ...formData,
        isActive: true
      };
      setEmployees(prev => [...prev, newEmployee]);
    }
    
    setFormData({ name: '', position: '', salary: 0, hireDate: '' });
    setShowAddForm(false);
  };

  const startEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      position: employee.position,
      salary: employee.salary,
      hireDate: employee.hireDate
    });
    setShowAddForm(true);
  };

  const deleteEmployee = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
  };

  const toggleEmployeeStatus = (id: string) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === id 
        ? { ...emp, isActive: !emp.isActive }
        : emp
    ));
  };

  const mockAttendance: Attendance[] = [
    { id: '1', employeeId: '1', date: '2024-01-15', status: 'present' },
    { id: '2', employeeId: '1', date: '2024-01-14', status: 'present' },
    { id: '3', employeeId: '1', date: '2024-01-13', status: 'late', notes: 'تأخر 30 دقيقة' },
    { id: '4', employeeId: '2', date: '2024-01-15', status: 'present' },
    { id: '5', employeeId: '2', date: '2024-01-14', status: 'absent', notes: 'إجازة مرضية' },
  ];

  const getAttendanceForEmployee = (employeeId: string) => {
    return mockAttendance.filter(att => att.employeeId === employeeId);
  };

  const getAttendanceStatusLabel = (status: Attendance['status']) => {
    switch (status) {
      case 'present': return 'حاضر';
      case 'absent': return 'غائب';
      case 'late': return 'متأخر';
      default: return status;
    }
  };

  const getAttendanceStatusColor = (status: Attendance['status']) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (attendanceView && selectedEmployee) {
    const employee = employees.find(emp => emp.id === selectedEmployee);
    const attendance = getAttendanceForEmployee(selectedEmployee);

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <Calendar className="w-6 h-6 text-amber-600 ml-2" />
              سجل الحضور - {employee?.name}
            </h2>
            <button
              onClick={() => {
                setAttendanceView(false);
                setSelectedEmployee(null);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              العودة للموظفين
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 font-medium text-gray-700">التاريخ</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">الحالة</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">ملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record) => (
                  <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-800">
                      {new Date(record.date).toLocaleDateString('ar')}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAttendanceStatusColor(record.status)}`}>
                        {getAttendanceStatusLabel(record.status)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {record.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Users className="w-6 h-6 text-amber-600 ml-2" />
            إدارة الموظفين
          </h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة موظف</span>
          </button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              {editingEmployee ? 'تعديل الموظف' : 'إضافة موظف جديد'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المنصب</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الراتب</label>
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData(prev => ({ ...prev, salary: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ التوظيف</label>
                <input
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, hireDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="md:col-span-2 flex justify-end space-x-3 space-x-reverse">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingEmployee(null);
                    setFormData({ name: '', position: '', salary: 0, hireDate: '' });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  {editingEmployee ? 'تحديث' : 'إضافة'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Employees Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 font-medium text-gray-700">الاسم</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">المنصب</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">الراتب</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">تاريخ التوظيف</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">الحالة</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-800">{employee.name}</td>
                  <td className="py-4 px-4 text-gray-600">{employee.position}</td>
                  <td className="py-4 px-4 text-gray-600">${employee.salary}</td>
                  <td className="py-4 px-4 text-gray-600">
                    {new Date(employee.hireDate).toLocaleDateString('ar')}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      employee.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {employee.isActive ? (
                        <>
                          <UserCheck className="w-3 h-3 ml-1" />
                          نشط
                        </>
                      ) : (
                        <>
                          <UserX className="w-3 h-3 ml-1" />
                          غير نشط
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button
                        onClick={() => {
                          setSelectedEmployee(employee.id);
                          setAttendanceView(true);
                        }}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                        title="عرض الحضور"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => startEdit(employee)}
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg"
                        title="تعديل"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => toggleEmployeeStatus(employee.id)}
                        className={`p-2 rounded-lg ${
                          employee.isActive
                            ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50'
                            : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                        }`}
                        title={employee.isActive ? 'إيقاف' : 'تفعيل'}
                      >
                        {employee.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                      
                      <button
                        onClick={() => deleteEmployee(employee.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {employees.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            لا يوجد موظفين مسجلين
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement;