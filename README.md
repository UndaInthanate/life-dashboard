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

### Sample Data (Optional)

If you want to test with sample data, you can add it through the web interface or run these SQL commands:

```sql
-- Sample Categories
INSERT INTO category (name, type) VALUES 
  ('เงินเดือน', 'income'),
  ('ค่าอาหาร', 'expense'),
  ('ค่าเดินทาง', 'expense'),
  ('ขายของออนไลน์', 'income');

-- Sample Transaction
INSERT INTO transaction (date, type, category_id, amount, detail) VALUES
  (CURRENT_DATE, 'income', 1, 30000.00, 'เงินเดือนประจำเดือน'),
  (CURRENT_DATE, 'expense', 2, 150.00, 'ข้าวเที่ยง');

-- Initial Balance Setting
INSERT INTO settings (key, value) VALUES
  ('initial_balance', '50000.00')
  ON CONFLICT (key) DO UPDATE SET value = '50000.00';
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
