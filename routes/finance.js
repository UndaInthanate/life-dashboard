const express = require("express");
const sql = require("../db");
const router = express.Router();

// ===============================
// init database (run once)
// ===============================
async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS category (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      type VARCHAR(10) NOT NULL
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS transaction (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      date DATE NOT NULL,
      type VARCHAR(10) NOT NULL,
      category_id INTEGER NOT NULL,
      amount NUMERIC(12,2) NOT NULL,
      detail TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS debt (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      amount NUMERIC(12,2) NOT NULL,
      monthly_payment NUMERIC(12,2),
      due_date DATE,
      note TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS fixed_expense (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      amount NUMERIC(12,2) NOT NULL,
      pay_date INTEGER,
      note TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      key VARCHAR(50) UNIQUE NOT NULL,
      value TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  // Health tables
  await sql`
    CREATE TABLE IF NOT EXISTS workout_plan (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      type VARCHAR(20) NOT NULL,
      target VARCHAR(100),
      note TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS workout_log (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      date DATE NOT NULL,
      type VARCHAR(20) NOT NULL,
      exercise VARCHAR(100),
      duration INTEGER,
      distance NUMERIC(10,2),
      weight NUMERIC(10,2),
      sets INTEGER,
      reps INTEGER,
      calories INTEGER,
      note TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  // Stock tables
  await sql`
    CREATE TABLE IF NOT EXISTS stock_portfolio (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      symbol VARCHAR(20) NOT NULL,
      name VARCHAR(100) NOT NULL,
      quantity NUMERIC(12,4) NOT NULL,
      buy_price NUMERIC(12,2) NOT NULL,
      buy_date DATE NOT NULL,
      current_price NUMERIC(12,2),
      note TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  // Goals tables
  await sql`
    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      type VARCHAR(20) NOT NULL,
      due_date DATE,
      status VARCHAR(20) DEFAULT 'in-progress',
      priority VARCHAR(20),
      category VARCHAR(50),
      progress INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      completed_at TIMESTAMP
    );
  `;
}
initDB();

// ===============================
// dashboard (summary page)
// ===============================
router.get("/", async (req, res) => {
  const transactions = await sql`
    SELECT t.*, c.name as category_name FROM transaction t
    LEFT JOIN category c ON t.category_id = c.id
    ORDER BY t.date DESC, t.id DESC
  `;
  const debts = await sql`
    SELECT * FROM debt ORDER BY due_date
  `;
  const fixed_expenses = await sql`
    SELECT * FROM fixed_expense ORDER BY pay_date
  `;
  const initialBalanceResult = await sql`
    SELECT value FROM settings WHERE key = 'initial_balance'
  `;
  const initialBalance = initialBalanceResult.length > 0
    ? parseFloat(initialBalanceResult[0].value)
    : 0;

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const currentBalance = initialBalance + totalIncome - totalExpense;
  const totalDebt = debts.reduce((sum, d) => sum + parseFloat(d.amount), 0);

  res.render("index", {
    initialBalance,
    totalIncome,
    totalExpense,
    currentBalance,
    totalDebt,
    transactions,
    debts,
    fixed_expenses,
    activePage: "overview"
  });
});

// ===============================
// transactions page
// ===============================
router.get("/transactions", async (req, res) => {
  const transactions = await sql`
    SELECT t.*, c.name as category_name FROM transaction t
    LEFT JOIN category c ON t.category_id = c.id
    ORDER BY t.date DESC, t.id DESC
  `;
  const categories = await sql`
    SELECT * FROM category ORDER BY type, name
  `;
  res.render("transactions", {
    transactions,
    categories,
    activePage: "transactions"
  });
});

// ===============================
// debts page
// ===============================
router.get("/debts", async (req, res) => {
  const debts = await sql`
    SELECT * FROM debt ORDER BY due_date
  `;
  res.render("debts", { debts, activePage: "debts" });
});

// ===============================
// fixed expenses page
// ===============================
router.get("/fixed-expenses", async (req, res) => {
  const fixed_expenses = await sql`
    SELECT * FROM fixed_expense ORDER BY pay_date
  `;
  res.render("fixed-expenses", { fixed_expenses, activePage: "fixed-expenses" });
});

// ===============================
// categories page
// ===============================
router.get("/categories", async (req, res) => {
  const categories = await sql`
    SELECT * FROM category ORDER BY type, name
  `;
  res.render("categories", { categories, activePage: "categories" });
});

// ===============================
// settings page
// ===============================
router.get("/settings", async (req, res) => {
  const initialBalanceResult = await sql`
    SELECT value FROM settings WHERE key = 'initial_balance'
  `;
  const initialBalance = initialBalanceResult.length > 0
    ? parseFloat(initialBalanceResult[0].value)
    : 0;
  res.render("settings", { initialBalance, activePage: "settings" });
});

// ===============================
// เพิ่มรายการรายรับรายจ่าย
// ===============================
router.post("/add-transaction", async (req, res) => {
  const { date, type, category_id, amount, detail } = req.body;
  await sql`
    INSERT INTO transaction (date, type, category_id, amount, detail)
    VALUES (${date}, ${type}, ${category_id}, ${amount}, ${detail})
  `;
  res.redirect("/");
});

// ===============================
// เพิ่มหมวดหมู่
// ===============================
router.post("/add-category", async (req, res) => {
  const { name, type } = req.body;
  await sql`
    INSERT INTO category (name, type)
    VALUES (${name}, ${type})
  `;
  res.redirect("/");
});

// ===============================
// เพิ่มหนี้สิน
// ===============================
router.post("/add-debt", async (req, res) => {
  const { name, amount, monthly_payment, due_date, note } = req.body;
  await sql`
    INSERT INTO debt (name, amount, monthly_payment, due_date, note)
    VALUES (${name}, ${amount}, ${monthly_payment}, ${due_date}, ${note})
  `;
  res.redirect("/");
});

// ===============================
// เพิ่มรายจ่ายคงที่
// ===============================
router.post("/add-fixed-expense", async (req, res) => {
  const { name, amount, pay_date, note } = req.body;
  await sql`
    INSERT INTO fixed_expense (name, amount, pay_date, note)
    VALUES (${name}, ${amount}, ${pay_date}, ${note})
  `;
  res.redirect("/");
});

// ===============================
// ตั้งค่าเงินต้น
// ===============================
router.post("/set-initial-balance", async (req, res) => {
  const { amount } = req.body;
  await sql`
    INSERT INTO settings (key, value, updated_at)
    VALUES ('initial_balance', ${amount}, CURRENT_TIMESTAMP)
    ON CONFLICT (key) DO UPDATE SET value = ${amount}, updated_at = CURRENT_TIMESTAMP
  `;
  res.redirect("/");
});

// ===============================
// HEALTH SECTION
// ===============================

// health overview
router.get("/health", async (req, res) => {
  const workout_plans = await sql`
    SELECT * FROM workout_plan ORDER BY created_at DESC
  `;
  const workout_logs = await sql`
    SELECT * FROM workout_log ORDER BY date DESC, id DESC LIMIT 20
  `;
  res.render("health", {
    workout_plans,
    workout_logs,
    activePage: "health"
  });
});

// เพิ่มแผนออกกำลังกาย
router.post("/add-workout-plan", async (req, res) => {
  const { name, type, target, note } = req.body;
  await sql`
    INSERT INTO workout_plan (name, type, target, note)
    VALUES (${name}, ${type}, ${target}, ${note})
  `;
  res.redirect("/health");
});

// เพิ่มบันทึกออกกำลังกาย
router.post("/add-workout-log", async (req, res) => {
  const { date, type, exercise, duration, distance, weight, sets, reps, calories, note } = req.body;
  await sql`
    INSERT INTO workout_log (date, type, exercise, duration, distance, weight, sets, reps, calories, note)
    VALUES (${date}, ${type}, ${exercise}, ${duration || null}, ${distance || null}, ${weight || null}, ${sets || null}, ${reps || null}, ${calories || null}, ${note})
  `;
  res.redirect("/health");
});

// ===============================
// STOCKS SECTION
// ===============================
router.get("/stocks", async (req, res) => {
  const portfolio = await sql`
    SELECT * FROM stock_portfolio ORDER BY symbol
  `;
  
  // Calculate total values
  let totalCost = 0;
  let totalValue = 0;
  const portfolioWithCalc = portfolio.map(stock => {
    const cost = parseFloat(stock.buy_price) * parseFloat(stock.quantity);
    const currentValue = parseFloat(stock.current_price || stock.buy_price) * parseFloat(stock.quantity);
    const profit = currentValue - cost;
    const profitPercent = (profit / cost) * 100;
    
    totalCost += cost;
    totalValue += currentValue;
    
    return {
      ...stock,
      cost: cost.toFixed(2),
      currentValue: currentValue.toFixed(2),
      profit: profit.toFixed(2),
      profitPercent: profitPercent.toFixed(2)
    };
  });
  
  const totalProfit = totalValue - totalCost;
  const totalProfitPercent = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
  
  res.render("stocks", { 
    portfolio: portfolioWithCalc,
    totalCost: totalCost.toFixed(2),
    totalValue: totalValue.toFixed(2),
    totalProfit: totalProfit.toFixed(2),
    totalProfitPercent: totalProfitPercent.toFixed(2),
    activePage: "stocks" 
  });
});

router.post("/add-stock", async (req, res) => {
  const { symbol, name, quantity, buy_price, buy_date, current_price, note } = req.body;
  await sql`
    INSERT INTO stock_portfolio (symbol, name, quantity, buy_price, buy_date, current_price, note)
    VALUES (${symbol}, ${name}, ${quantity}, ${buy_price}, ${buy_date}, ${current_price || null}, ${note})
  `;
  res.redirect("/stocks");
});

router.post("/update-stock-price", async (req, res) => {
  const { id, current_price } = req.body;
  await sql`
    UPDATE stock_portfolio SET current_price = ${current_price} WHERE id = ${id}
  `;
  res.redirect("/stocks");
});

// ===============================
// GOALS SECTION
// ===============================
router.get("/goals", async (req, res) => {
  const goals = await sql`
    SELECT * FROM goals ORDER BY 
      CASE status 
        WHEN 'in-progress' THEN 1 
        WHEN 'completed' THEN 2 
        ELSE 3 
      END,
      due_date ASC
  `;
  
  // Group by type
  const daily = goals.filter(g => g.type === 'daily');
  const weekly = goals.filter(g => g.type === 'weekly');
  const monthly = goals.filter(g => g.type === 'monthly');
  const yearly = goals.filter(g => g.type === 'yearly');
  
  res.render("goals", { 
    goals,
    daily,
    weekly,
    monthly,
    yearly,
    activePage: "goals" 
  });
});

router.post("/add-goal", async (req, res) => {
  const { title, description, type, due_date, priority, category, progress } = req.body;
  await sql`
    INSERT INTO goals (title, description, type, due_date, priority, category, progress)
    VALUES (${title}, ${description}, ${type}, ${due_date || null}, ${priority}, ${category}, ${progress || 0})
  `;
  res.redirect("/goals");
});

router.post("/update-goal-progress", async (req, res) => {
  const { id, progress } = req.body;
  const status = parseInt(progress) >= 100 ? 'completed' : 'in-progress';
  const completed_at = status === 'completed' ? new Date() : null;
  
  await sql`
    UPDATE goals 
    SET progress = ${progress}, status = ${status}, completed_at = ${completed_at}
    WHERE id = ${id}
  `;
  res.redirect("/goals");
});

router.post("/delete-goal", async (req, res) => {
  const { id } = req.body;
  await sql`
    DELETE FROM goals WHERE id = ${id}
  `;
  res.redirect("/goals");
});

module.exports = router;
