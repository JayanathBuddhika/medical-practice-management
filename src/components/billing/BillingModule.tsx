'use client'

import { useState, useEffect } from 'react'

interface Bill {
  id: string
  billNumber: string
  patientName: string
  patientId: string
  consultationDate: string
  consultationFee: number
  procedureCharges: number
  medicationCharges: number
  investigationCharges: number
  otherCharges: number
  discount: number
  totalAmount: number
  paidAmount: number
  balanceAmount: number
  paymentMode: 'CASH' | 'CARD' | 'UPI' | 'BANK_TRANSFER' | 'INSURANCE'
  paymentStatus: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE'
  dueDate: string
  items: BillItem[]
}

interface BillItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

const sampleBills: Bill[] = [
  {
    id: '1',
    billNumber: 'INV2025001',
    patientName: 'Rajesh Kumar',
    patientId: 'PT2025001',
    consultationDate: '2025-01-22',
    consultationFee: 500,
    procedureCharges: 0,
    medicationCharges: 250,
    investigationCharges: 800,
    otherCharges: 0,
    discount: 50,
    totalAmount: 1500,
    paidAmount: 1500,
    balanceAmount: 0,
    paymentMode: 'UPI',
    paymentStatus: 'PAID',
    dueDate: '2025-01-22',
    items: [
      { description: 'General Consultation', quantity: 1, rate: 500, amount: 500 },
      { description: 'CBC Test', quantity: 1, rate: 400, amount: 400 },
      { description: 'Thyroid Profile', quantity: 1, rate: 400, amount: 400 },
      { description: 'Paracetamol 500mg x10', quantity: 1, rate: 50, amount: 50 },
      { description: 'Azithromycin 500mg x3', quantity: 1, rate: 200, amount: 200 }
    ]
  },
  {
    id: '2',
    billNumber: 'INV2025002',
    patientName: 'Priya Sharma',
    patientId: 'PT2025002',
    consultationDate: '2025-01-21',
    consultationFee: 500,
    procedureCharges: 1200,
    medicationCharges: 150,
    investigationCharges: 600,
    otherCharges: 100,
    discount: 0,
    totalAmount: 2550,
    paidAmount: 1000,
    balanceAmount: 1550,
    paymentMode: 'CASH',
    paymentStatus: 'PARTIAL',
    dueDate: '2025-01-28',
    items: [
      { description: 'Follow-up Consultation', quantity: 1, rate: 500, amount: 500 },
      { description: 'Minor Procedure', quantity: 1, rate: 1200, amount: 1200 },
      { description: 'X-Ray Chest', quantity: 1, rate: 600, amount: 600 },
      { description: 'Omeprazole 20mg x14', quantity: 1, rate: 150, amount: 150 },
      { description: 'Dressing Material', quantity: 1, rate: 100, amount: 100 }
    ]
  }
]

export function BillingModule() {
  const [activeView, setActiveView] = useState<'create' | 'pending' | 'paid' | 'overdue'>('create')
  const [bills, setBills] = useState<Bill[]>(sampleBills)
  const [searchTerm, setSearchTerm] = useState('')
  const [newBill, setNewBill] = useState({
    patientName: '',
    patientId: '',
    consultationFee: 500,
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }] as BillItem[]
  })

  const addBillItem = () => {
    setNewBill(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    }))
  }

  const removeBillItem = (index: number) => {
    setNewBill(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const updateBillItem = (index: number, field: keyof BillItem, value: string | number) => {
    setNewBill(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index) {
          const updated = { ...item, [field]: value }
          if (field === 'quantity' || field === 'rate') {
            updated.amount = updated.quantity * updated.rate
          }
          return updated
        }
        return item
      })
    }))
  }

  const calculateTotal = () => {
    const itemsTotal = newBill.items.reduce((sum, item) => sum + item.amount, 0)
    return newBill.consultationFee + itemsTotal
  }

  const createBill = () => {
    const bill: Bill = {
      id: Date.now().toString(),
      billNumber: `INV${Date.now().toString().slice(-6)}`,
      patientName: newBill.patientName,
      patientId: newBill.patientId,
      consultationDate: new Date().toISOString().split('T')[0],
      consultationFee: newBill.consultationFee,
      procedureCharges: 0,
      medicationCharges: 0,
      investigationCharges: 0,
      otherCharges: newBill.items.reduce((sum, item) => sum + item.amount, 0),
      discount: 0,
      totalAmount: calculateTotal(),
      paidAmount: 0,
      balanceAmount: calculateTotal(),
      paymentMode: 'CASH',
      paymentStatus: 'PENDING',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: newBill.items.filter(item => item.description)
    }
    
    setBills(prev => [bill, ...prev])
    setNewBill({
      patientName: '',
      patientId: '',
      consultationFee: 500,
      items: [{ description: '', quantity: 1, rate: 0, amount: 0 }]
    })
  }

  const updatePayment = (billId: string, paidAmount: number, paymentMode: Bill['paymentMode']) => {
    setBills(prev => prev.map(bill => {
      if (bill.id === billId) {
        const newPaidAmount = bill.paidAmount + paidAmount
        const balanceAmount = bill.totalAmount - newPaidAmount
        const paymentStatus: Bill['paymentStatus'] = 
          balanceAmount <= 0 ? 'PAID' : 
          newPaidAmount > 0 ? 'PARTIAL' : 'PENDING'
        
        return {
          ...bill,
          paidAmount: newPaidAmount,
          balanceAmount,
          paymentStatus,
          paymentMode
        }
      }
      return bill
    }))
  }

  const getStatusColor = (status: Bill['paymentStatus']) => {
    switch (status) {
      case 'PAID': return '#10b981'
      case 'PARTIAL': return '#f59e0b'
      case 'PENDING': return '#6b7280'
      case 'OVERDUE': return '#ef4444'
    }
  }

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    switch (activeView) {
      case 'pending': return matchesSearch && bill.paymentStatus === 'PENDING'
      case 'paid': return matchesSearch && bill.paymentStatus === 'PAID'
      case 'overdue': return matchesSearch && bill.paymentStatus === 'OVERDUE'
      default: return matchesSearch
    }
  })

  const renderCreateBill = () => (
    <div>
      <h3 style={{ color: '#1e3a8a', marginBottom: '24px' }}>Create New Bill</h3>
      
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Patient Name</label>
          <input
            type="text"
            className="form-input"
            value={newBill.patientName}
            onChange={(e) => setNewBill(prev => ({ ...prev, patientName: e.target.value }))}
            placeholder="Enter patient name"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Patient ID</label>
          <input
            type="text"
            className="form-input"
            value={newBill.patientId}
            onChange={(e) => setNewBill(prev => ({ ...prev, patientId: e.target.value }))}
            placeholder="Enter patient ID"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Consultation Fee</label>
        <input
          type="number"
          className="form-input"
          value={newBill.consultationFee}
          onChange={(e) => setNewBill(prev => ({ ...prev, consultationFee: parseFloat(e.target.value) || 0 }))}
          style={{ maxWidth: '200px' }}
        />
      </div>

      <h4 style={{ color: '#1e3a8a', margin: '32px 0 16px' }}>Additional Items</h4>
      
      {newBill.items.map((item, index) => (
        <div key={index} style={{ 
          marginBottom: '16px', 
          padding: '16px', 
          border: '1px solid #e2e8f0', 
          borderRadius: '8px' 
        }}>
          <div className="form-row">
            <div className="form-group" style={{ flex: '2' }}>
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-input"
                value={item.description}
                onChange={(e) => updateBillItem(index, 'description', e.target.value)}
                placeholder="Item description"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Qty</label>
              <input
                type="number"
                className="form-input"
                value={item.quantity}
                onChange={(e) => updateBillItem(index, 'quantity', parseInt(e.target.value) || 0)}
                min="1"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Rate</label>
              <input
                type="number"
                className="form-input"
                value={item.rate}
                onChange={(e) => updateBillItem(index, 'rate', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Amount</label>
              <input
                type="number"
                className="form-input"
                value={item.amount}
                disabled
                style={{ background: '#f8fafc' }}
              />
            </div>
          </div>
          {newBill.items.length > 1 && (
            <button
              type="button"
              className="btn btn-danger btn-small"
              onClick={() => removeBillItem(index)}
              style={{ marginTop: '8px' }}
            >
              Remove Item
            </button>
          )}
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button type="button" className="btn btn-secondary" onClick={addBillItem}>
          Add Item
        </button>
        <div style={{ fontSize: '18px', fontWeight: '600', color: '#1e3a8a' }}>
          Total: ₹{calculateTotal().toLocaleString()}
        </div>
      </div>

      <button className="btn btn-success" onClick={createBill}>
        Create Bill
      </button>
    </div>
  )

  const renderBillsList = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ color: '#1e3a8a' }}>
          {activeView === 'pending' && 'Pending Payments'}
          {activeView === 'paid' && 'Paid Bills'}
          {activeView === 'overdue' && 'Overdue Bills'}
        </h3>
        <input
          type="text"
          className="form-input"
          placeholder="Search bills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {filteredBills.map(bill => (
          <div key={bill.id} className="dashboard-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h4 style={{ color: '#1e3a8a', marginBottom: '4px' }}>{bill.patientName}</h4>
                <p style={{ color: '#64748b', fontSize: '14px' }}>
                  {bill.billNumber} • {bill.patientId} • {bill.consultationDate}
                </p>
              </div>
              <span 
                className="status-badge"
                style={{ 
                  background: getStatusColor(bill.paymentStatus) + '20',
                  color: getStatusColor(bill.paymentStatus),
                  border: `1px solid ${getStatusColor(bill.paymentStatus)}40`
                }}
              >
                {bill.paymentStatus}
              </span>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
              gap: '12px',
              marginBottom: '16px',
              padding: '12px',
              background: '#f8fafc',
              borderRadius: '8px'
            }}>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Total Amount</div>
                <div style={{ fontWeight: '600', color: '#1e3a8a' }}>₹{bill.totalAmount.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Paid Amount</div>
                <div style={{ fontWeight: '600', color: '#10b981' }}>₹{bill.paidAmount.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Balance</div>
                <div style={{ fontWeight: '600', color: bill.balanceAmount > 0 ? '#ef4444' : '#10b981' }}>
                  ₹{bill.balanceAmount.toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Payment Mode</div>
                <div style={{ fontWeight: '600', color: '#374151' }}>{bill.paymentMode}</div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h5 style={{ color: '#374151', marginBottom: '8px', fontSize: '14px' }}>Bill Items:</h5>
              {bill.items.map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '4px 0',
                  fontSize: '14px'
                }}>
                  <span>{item.description} (x{item.quantity})</span>
                  <span>₹{item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-secondary btn-small">
                Print Bill
              </button>
              {bill.balanceAmount > 0 && (
                <button 
                  className="btn btn-success btn-small"
                  onClick={() => updatePayment(bill.id, bill.balanceAmount, 'CASH')}
                >
                  Mark as Paid
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="screen-content">
      {/* Navigation Tabs */}
      <div className="screen-tabs" style={{ marginBottom: '24px' }}>
        <button
          className={`tab-btn ${activeView === 'create' ? 'active' : ''}`}
          onClick={() => setActiveView('create')}
        >
          💰 Create Bill
        </button>
        <button
          className={`tab-btn ${activeView === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveView('pending')}
        >
          ⏳ Pending ({bills.filter(b => b.paymentStatus === 'PENDING').length})
        </button>
        <button
          className={`tab-btn ${activeView === 'paid' ? 'active' : ''}`}
          onClick={() => setActiveView('paid')}
        >
          ✅ Paid ({bills.filter(b => b.paymentStatus === 'PAID').length})
        </button>
        <button
          className={`tab-btn ${activeView === 'overdue' ? 'active' : ''}`}
          onClick={() => setActiveView('overdue')}
        >
          🚨 Overdue ({bills.filter(b => b.paymentStatus === 'OVERDUE').length})
        </button>
      </div>

      {/* Content */}
      {activeView === 'create' ? renderCreateBill() : renderBillsList()}
    </div>
  )
}