# 💰 Life Dashboard

Personal life management web application built with Node.js and Express, featuring comprehensive tracking for Finance, Health, Stocks, and Goals.

## ✨ Features

### 💰 Finance Management
- **Transactions**: Track income and expenses with categories
- **Debts**: Monitor outstanding debts and monthly payments
- **Fixed Expenses**: Manage recurring monthly expenses
- **Categories**: Organize transactions with custom categories
- **Dashboard**: Real-time financial overview with balance calculations

### 💪 Health & Fitness
- **Workout Plans**: Create and manage exercise routines
- **Workout Logs**: Track workouts with detailed metrics
  - Weight training: Sets, reps, weight
  - Cardio: Duration, distance, calories
- **Exercise History**: View past workout sessions

### 📈 Stock Portfolio
- **Portfolio Tracking**: Monitor stock holdings
- **Profit/Loss Calculations**: Automatic P&L calculations
- **Price Updates**: Update current stock prices
- **Performance Metrics**: Track total cost, current value, and returns

### 🎯 Goals Management
- **Goal Setting**: Create goals with priorities and categories
- **Progress Tracking**: Visual progress bars for each goal
- **Goal Types**: Daily, weekly, monthly, and yearly goals
- **Status Management**: Mark goals as completed or in-progress

## 🚀 Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (Neon)
- **Template Engine**: EJS
- **Styling**: Custom CSS with dark/light theme support
- **Languages**: Thai/English bilingual support

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/life-dashboard.git
cd life-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
DATABASE_URL=your_postgresql_connection_string
PORT=3000
```

4. The database tables will be created automatically on first run. The application uses the `initDB()` function in `routes/finance.js` to create all necessary tables if they don't exist.

5. Start the application:
```bash
node app.js
```

6. Open your browser and navigate to:
```
http://localhost:3000
```

7. (Optional) Add sample data for testing - see "Sample Data" section below.

## 🗄️ Database Schema

The application automatically creates the following tables on startup:

- `category` - Transaction categories
- `transaction` - Income and expense records
- `debt` - Debt tracking
- `fixed_expense` - Recurring expenses
- `settings` - Application settings
- `workout_plan` - Exercise plans
- `workout_log` - Workout history
- `stock_portfolio` - Stock holdings
- `goals` - Personal goals

### Automatic Database Setup

When you run the application for the first time, it will automatically:
1. Connect to your PostgreSQL database using `DATABASE_URL`
2. Create all required tables if they don't exist
3. You can start using the application immediately

**No manual SQL scripts needed!** The `initDB()` function handles everything.

### Manual Database Setup (Optional)

If you prefer to create tables manually, here are the SQL statements:

```sql
-- Finance Tables
CREATE TABLE IF NOT EXISTS category (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  type VARCHAR(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS transaction (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  date DATE NOT NULL,
  type VARCHAR(10) NOT NULL,
  category_id INTEGER NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  detail TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS debt (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  monthly_payment NUMERIC(12,2),
  due_date DATE,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fixed_expense (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  pay_date INTEGER,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  key VARCHAR(50) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Health Tables
CREATE TABLE IF NOT EXISTS workout_plan (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL,
  target VARCHAR(100),
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

-- Stock Table
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

-- Goals Table
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
```

### Sample Data (Optional)

If you want to test with sample data, you can add it through the web interface or run these SQL commands:

```sql
-- Sample Categories
INSERT INTO category (name, type) VALUES 
  ('เงินเดือน', 'income'),
  ('ค่าอาหาร', 'expense'),
  ('ค่าเดินทาง', 'expense'),
  ('ขายของออนไลน์', 'income');

-- Sample Transactions
INSERT INTO transaction (date, type, category_id, amount, detail) VALUES
  (CURRENT_DATE, 'income', 1, 30000.00, 'เงินเดือนประจำเดือน'),
  (CURRENT_DATE, 'expense', 2, 150.00, 'ข้าวเที่ยง'),
  (CURRENT_DATE, 'expense', 3, 50.00, 'ค่ารถเมล์');

-- Sample Debt
INSERT INTO debt (name, amount, monthly_payment, due_date, note) VALUES
  ('สินเชื่อบ้าน', 2000000.00, 15000.00, '2026-03-01', 'ผ่อน 20 ปี');

-- Sample Fixed Expense
INSERT INTO fixed_expense (name, amount, pay_date, note) VALUES
  ('ค่าเน็ต', 599.00, 5, 'จ่ายทุกวันที่ 5'),
  ('ค่าไฟ', 1200.00, 10, 'โดยประมาณ');

-- Initial Balance Setting
INSERT INTO settings (key, value) VALUES
  ('initial_balance', '50000.00')
  ON CONFLICT (key) DO UPDATE SET value = '50000.00';

-- Sample Workout Plan
INSERT INTO workout_plan (name, type, target, note) VALUES
  ('Push Day', 'weight', 'อก, ไหล่, ไตรเซ็ป', 'จันทร์-พุธ-ศุกร์');

-- Sample Workout Log
INSERT INTO workout_log (date, type, exercise, weight, sets, reps, note) VALUES
  (CURRENT_DATE, 'weight', 'Bench Press', 60.0, 3, 10, 'รู้สึกดี');

-- Sample Stock
INSERT INTO stock_portfolio (symbol, name, quantity, buy_price, buy_date, current_price) VALUES
  ('AAPL', 'Apple Inc.', 10, 150.00, '2025-01-15', 175.00),
  ('TSLA', 'Tesla Inc.', 5, 200.00, '2025-02-01', 195.00);

-- Sample Goals
INSERT INTO goals (title, description, type, due_date, priority, category, progress) VALUES
  ('ออกกำลังกาย 5 วัน', 'ออกกำลังกายอย่างน้อย 30 นาที', 'weekly', CURRENT_DATE + 7, 'high', 'สุขภาพ', 40),
  ('อ่านหนังสือ 1 เล่ม', 'อ่านหนังสือพัฒนาตนเอง', 'monthly', CURRENT_DATE + 30, 'medium', 'การเรียนรู้', 25);
```

## 🎨 Features Highlights

- **Dark/Light Mode**: Toggle between themes with persistent preference
- **Bilingual Support**: Switch between Thai and English
- **Responsive Design**: Mobile-friendly interface
- **Real-time Calculations**: Automatic balance and P&L computations
- **Visual Progress**: Progress bars, badges, and color-coded indicators

## 📁 Project Structure

```
life-dashboard/
├── app.js                 # Main application entry point
├── db.js                  # Database connection
├── package.json           # Dependencies
├── .env                   # Environment variables (create this)
├── routes/
│   └── finance.js         # All route handlers
├── views/                 # EJS templates
│   ├── index.ejs          # Dashboard overview
│   ├── transactions.ejs   # Transaction management
│   ├── debts.ejs          # Debt tracking
│   ├── fixed-expenses.ejs # Fixed expenses
│   ├── categories.ejs     # Category management
│   ├── settings.ejs       # Settings page
│   ├── health.ejs         # Health & fitness
│   ├── stocks.ejs         # Stock portfolio
│   └── goals.ejs          # Goals management
└── public/
    └── style.css          # Styling and themes
```

## 🔧 Configuration

### Database Setup
This application uses PostgreSQL. You can use:
- [Neon](https://neon.tech/) - Serverless PostgreSQL (recommended)
- Local PostgreSQL installation
- Any PostgreSQL-compatible database

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default: 3000)

## 🌐 Usage

1. **Initial Setup**: Set your initial balance in Settings
2. **Add Categories**: Create income and expense categories
3. **Track Transactions**: Record daily income and expenses
4. **Monitor Finances**: View real-time balance and summaries
5. **Log Workouts**: Track your fitness activities
6. **Manage Stocks**: Monitor your investment portfolio
7. **Set Goals**: Create and track personal goals

## 🎯 Roadmap

- [ ] Charts and analytics
- [ ] Budget planning
- [ ] Export data to CSV/Excel
- [ ] Mobile app
- [ ] Multi-user support
- [ ] API integration for stock prices
- [ ] Recurring transaction automation

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👤 Author

Created with ❤️ for personal life management

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Note**: This is a personal life management tool. Make sure to keep your `.env` file secure and never commit it to version control.
