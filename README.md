🍽️ Meal & Deal — Restaurant Digital Menu

A modern, mobile-first digital restaurant menu built with React, TypeScript, Tailwind CSS, Supabase, and Vite.

Customers can scan a QR code, browse the menu, select items and options, add them to a cart, and call the restaurant to place a pickup order.

🥬 100% Pure Vegetarian
📦 Pickup Only
📞 Call to Order

🌐 Live Website

Production:
https://restaurant-menu-two-flame.vercel.app/

GitHub:
https://github.com/vishistbasnet/Restaurant-Menu

✨ Features

👨‍🍳 Customer Experience

📱 Mobile-first responsive design

🍽️ Digital restaurant menu

🥬 100% pure vegetarian branding

📂 Category-based menu browsing

🏷️ Menu item pricing and options

🛒 Shopping cart

➕ Increase/decrease item quantity

🗑️ Remove items from cart

🧹 Clear cart

📋 Order summary generation

📞 Call to Order

💬 WhatsApp ordering support

📦 Pickup-only ordering flow

🟢 Restaurant open/closed status

🔴 Ordering automatically disabled when closed

📍 Restaurant location with Google Maps

📲 QR-code menu access

🔐 Admin Dashboard

The project includes a protected admin dashboard for restaurant management.

Admin Authentication

Supabase Authentication

Protected admin routes

Admin user verification

Restaurant-specific admin access

Unauthorized users are redirected to login

Dashboard

Restaurant overview

Restaurant status

Menu information

Quick management actions

Category Management

Admins can:

Create categories

Edit categories

Delete categories

Manage category ordering

Menu Management

Admins can:

Create menu items

Edit menu items

Delete menu items

Set prices

Manage availability

Assign items to categories

Manage item options

Restaurant Settings

Admins can manage:

Restaurant name

Phone number

WhatsApp number

Opening time

Closing time

Accept Orders / ordering status

Pickup-only configuration

QR Code

The admin dashboard provides a QR code for the public restaurant menu.

Customers can scan the QR code and open the live menu directly.

⚡ Active / Deactive Ordering

The restaurant does not need to shut down the website when orders are unavailable.

The admin can remotely control whether orders are accepted.

Active

🟢 Restaurant Open
↓
Customers can browse
↓
Customers can add items
↓
Call / WhatsApp ordering available

Deactive

🔴 Ordering Closed
↓
Customers can still browse the menu
↓
Ordering actions are disabled

Restaurant opening hours are also handled through the application.

The manual ordering status takes priority when the restaurant needs to stop accepting orders.

🏗️ Tech Stack

Frontend

React

TypeScript

Vite

Tailwind CSS

Framer Motion

React Router

Lucide React

Backend / Database

Supabase

PostgreSQL

Supabase Authentication

Row Level Security (RLS)

QR

qrcode.react

Deployment

Vercel

Version Control

Git

GitHub

📁 Project Structure

Restaurant-Menu/
│
├── public/
│
├── src/
│   ├── admin/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── assets/
│   │   └── meal-deal-food-hero.webp
│   ├── components/
│   │   ├── cart/
│   │   ├── layout/
│   │   └── menu/
│   ├── context/
│   │   ├── CartContext.tsx
│   │   ├── CartContextValue.ts
│   │   └── useCart.ts
│   ├── data/
│   ├── lib/
│   │   └── supabase.ts
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── .env.local
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vercel.json
├── vite.config.ts
└── README.md

🗄️ Database Architecture

The application uses Supabase PostgreSQL.

Main Tables

restaurants
    │
    ├── categories
    │       │
    │       └── menu_items
    │               │
    │               └── menu_item_options
    │
    └── admin_users

Restaurants

Stores restaurant information such as:

Name

Phone

WhatsApp

Pickup configuration

Active/inactive status

Opening time

Closing time

Categories

Stores menu categories belonging to a restaurant.

Menu Items

Stores:

Item name

Description

Price

Availability

Category

Restaurant

Menu Item Options

Allows menu items to have multiple pricing/options.

Example:

Veg Momos

Half  → ₹80
Full  → ₹120

Admin Users

Connects authenticated Supabase users with their restaurant.

This allows the application to support multiple restaurants in the future.

🔒 Security

The project uses Supabase Row Level Security (RLS).

Public Access

Customers can only access appropriate public restaurant/menu data.

Admin Access

Admin operations require:

Supabase Authentication
        ↓
Authenticated User
        ↓
admin_users verification
        ↓
Restaurant-specific access

Database policies restrict administrators to their assigned restaurant.

Additional database integrity protection prevents menu items from being assigned to categories belonging to another restaurant.

🧑‍💻 Local Development

1. Clone the repository

git clone https://github.com/vishistbasnet/Restaurant-Menu.git

2. Enter the project

cd Restaurant-Menu

3. Install dependencies

npm install

4. Configure environment variables

Create:

.env.local

Add:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

Do not commit .env.local.

5. Start the development server

npm run dev

🧪 Testing

Run ESLint

npm run lint

Create production build

npm run build

The production build performs:

TypeScript compilation
        ↓
Vite production build
        ↓
Optimized assets
        ↓
Code-split JavaScript

⚡ Performance

The application uses route-based code splitting for the admin dashboard.

Admin pages are loaded only when required.

Examples include:

AdminLogin
AdminDashboard
AdminCategories
AdminMenu
AdminSettings
AdminQRCode

The hero background is optimized as WebP and is approximately 124 KB in production.

📲 QR Code Flow

The intended customer flow is:

Restaurant QR Code
        ↓
Public Menu
        ↓
Browse Categories
        ↓
Select Food
        ↓
Choose Options
        ↓
Add to Cart
        ↓
Review Order
        ↓
Call / WhatsApp
        ↓
Restaurant Confirms Order
        ↓
Customer Pickup

🚫 No Delivery

This application currently uses a pickup-only business model.

There is no:

Delivery address

Delivery fee

Delivery tracking

Online payment gateway

Delivery rider system

The ordering process is:

Customer places order
        ↓
Restaurant confirms
        ↓
Restaurant prepares food
        ↓
Customer picks up order

🎨 Design

The interface follows a modern restaurant-focused visual system.

Brand Direction

Dark charcoal / near-black backgrounds

Gold / yellow primary accents

Warm coral / pink accents

White and soft-gray typography

Rounded cards

Responsive layouts

Mobile-first interaction design

🚀 Deployment

The application is deployed using Vercel.

Production architecture:

Customer
   │
   ▼
Vercel
   │
   ▼
React + Vite Application
   │
   ▼
Supabase
   │
   ├── PostgreSQL
   ├── Authentication
   └── Row Level Security

🔧 Environment Variables

Required:

VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=

For production QR generation:

VITE_PUBLIC_MENU_URL=https://restaurant-menu-two-flame.vercel.app/

Never commit:

.env
.env.local
.env.*.local

📋 Available Scripts

Command

Purpose

npm install

Install dependencies

npm run dev

Start development server

npm run lint

Run ESLint

npm run build

Create production build

🛣️ Future Improvements

Possible future enhancements include:

📊 Advanced order management

🔔 Real-time order notifications

📈 Sales analytics

🧾 Printable order receipts

🖨️ Kitchen order workflow

👥 Multiple admin roles

🏪 Full multi-restaurant management

📱 PWA support

🌐 Custom domain

🔐 Additional authentication hardening

🧪 Automated end-to-end testing

👨‍💻 Developer

Vishist Chhetri

GitHub:
https://github.com/vishistbasnet

LinkedIn:
https://www.linkedin.com/in/vishist-basnet-36a735323/

📄 License

This project is developed as a restaurant digital-menu application.

© Meal & Deal