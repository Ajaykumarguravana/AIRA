import { products as demoProductsList, kpiMetrics as demoKpiMetrics, storeInfo as demoStoreInfo } from './demoData'

// Get current user email
export const getCurrentUserEmail = () => {
  return (localStorage.getItem('aira_user_email') || 'demo@airamart.in').toLowerCase().trim()
}

// Check if currently logged in user is Demo Account
export const isDemoUser = () => {
  return localStorage.getItem('aira_is_demo') === 'true'
}

// Get Active Registered Users Database from LocalStorage
export const getRegisteredUsers = () => {
  try {
    const stored = localStorage.getItem('aira_registered_users')
    return stored ? JSON.parse(stored) : [
      {
        email: 'demo@airamart.in',
        password: 'DemoUser@123',
        name: 'Demo Store Manager',
        storeName: 'AIRA Demo Mart & Superstore',
        shopType: 'Grocery & General Retail',
        location: 'Bengaluru, Karnataka',
        isDemo: true
      }
    ]
  } catch (e) {
    return []
  }
}

// Save a new registered user into database
export const registerUser = (userData) => {
  const users = getRegisteredUsers()
  const exists = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())
  if (exists) {
    throw new Error('An account with this email address already exists. Please login instead.')
  }
  
  const newUser = {
    ...userData,
    isDemo: false,
    createdAt: new Date().toISOString()
  }

  users.push(newUser)
  localStorage.setItem('aira_registered_users', JSON.stringify(users))
  return newUser
}

// Validate credentials against DB/registered users
export const authenticateUser = (email, password) => {
  const users = getRegisteredUsers()
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
  
  // Demo Fallback Check
  if (!user && email.toLowerCase() === 'demo@airamart.in' && password === 'DemoUser@123') {
    return {
      email: 'demo@airamart.in',
      password: 'DemoUser@123',
      name: 'Demo Store Manager',
      storeName: 'AIRA Demo Mart & Superstore',
      shopType: 'Grocery & General Retail',
      location: 'Bengaluru',
      isDemo: true
    }
  }

  return user || null
}

// PERMANENT USER PRODUCT STORAGE
export const getUserProducts = () => {
  const email = getCurrentUserEmail()
  const storageKey = `aira_user_products_${email}`
  const stored = localStorage.getItem(storageKey)

  if (stored !== null) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      console.error("Failed to parse stored user products:", e)
    }
  }

  // Initial Seed: Demo account gets demo products, New user gets empty array []
  const initial = isDemoUser() ? demoProductsList : []
  localStorage.setItem(storageKey, JSON.stringify(initial))
  return initial
}

// SAVE USER PRODUCTS PERMANENTLY TO LOCALSTORAGE
export const saveUserProducts = (newProducts) => {
  const email = getCurrentUserEmail()
  const storageKey = `aira_user_products_${email}`
  localStorage.setItem(storageKey, JSON.stringify(newProducts))
}

// Add a single product permanently
export const addProductToUserStore = (newProduct) => {
  const current = getUserProducts()
  const updated = [newProduct, ...current]
  saveUserProducts(updated)
  return updated
}

// Get Store Information
export const getActiveStoreInfo = () => {
  if (isDemoUser()) {
    return demoStoreInfo
  }

  return {
    name: localStorage.getItem('aira_store_name') || 'My Retail Store',
    owner: localStorage.getItem('aira_user_name') || 'Store Owner',
    category: localStorage.getItem('aira_store_type') || 'General Store',
    city: localStorage.getItem('aira_store_location') || 'Bengaluru',
    currency: '₹',
    isDemo: false
  }
}

// Get Store KPI Summary dynamically based on stored products
export const getUserKpis = () => {
  const prods = getUserProducts()
  
  if (isDemoUser()) {
    return demoKpiMetrics
  }

  if (prods.length === 0) {
    return {
      todaysSales: "₹0",
      salesChange: "0%",
      orders: "0",
      ordersChange: "0%",
      productsSold: "0",
      productsSoldChange: "0%",
      revenue: "₹0",
      revenueChange: "0%",
      profit: "₹0",
      profitChange: "0%",
      stockValue: "₹0",
      stockValueChange: "0%",
      lowStockCount: "0",
      lowStockChange: "0",
      newCustomers: "0",
      newCustomersChange: "0%",
      isEmpty: true
    }
  }

  const totalRev = prods.reduce((acc, p) => acc + (p.revenue || (p.unitsSold || 0) * p.price || 0), 0)
  const totalProf = prods.reduce((acc, p) => acc + (p.totalProfit || (p.unitsSold || 0) * (p.unitProfit || (p.price * 0.25)) || 0), 0)
  const totalStockVal = prods.reduce((acc, p) => acc + ((p.stock || 0) * (p.price || 0)), 0)
  const lowStock = prods.filter(p => (p.stock || 0) <= (p.minStock || 15)).length
  const totalUnitsSold = prods.reduce((acc, p) => acc + (p.unitsSold || 0), 0)

  return {
    todaysSales: `₹${totalRev.toLocaleString('en-IN')}`,
    salesChange: totalRev > 0 ? "+100%" : "0%",
    orders: `${totalUnitsSold}`,
    ordersChange: totalUnitsSold > 0 ? "+100%" : "0%",
    productsSold: `${totalUnitsSold}`,
    productsSoldChange: totalUnitsSold > 0 ? "+100%" : "0%",
    revenue: `₹${totalRev.toLocaleString('en-IN')}`,
    revenueChange: totalRev > 0 ? "+100%" : "0%",
    profit: `₹${totalProf.toLocaleString('en-IN')}`,
    profitChange: totalProf > 0 ? "+100%" : "0%",
    stockValue: `₹${totalStockVal.toLocaleString('en-IN')}`,
    stockValueChange: "+0%",
    lowStockCount: `${lowStock}`,
    lowStockChange: "0",
    newCustomers: `${totalUnitsSold > 0 ? Math.min(totalUnitsSold, 10) : 0}`,
    newCustomersChange: "0%",
    isEmpty: false
  }
}
