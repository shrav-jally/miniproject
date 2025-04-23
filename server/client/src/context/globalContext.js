import React, { useContext, useState, useEffect } from "react"
import axios from 'axios'

const BASE_URL = "http://localhost:5000/api/v1/";

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);

    // Setup Axios Interceptor
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        const interceptor = axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        return () => {
            axios.interceptors.request.eject(interceptor);
        };
    }, []);

    // 💰 Add Income
    const addIncome = async (income) => {
        try {
            await axios.post(`${BASE_URL}add-income`, income);
            getIncomes();
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "Failed to add income");
        }
    };

    // 📥 Get Incomes
    const getIncomes = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}get-incomes`);
            setIncomes(data);
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "Failed to fetch incomes");
        }
    };

    // 🗑️ Delete Income
    const deleteIncome = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-income/${id}`);
            getIncomes();
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "Failed to delete income");
        }
    };

    const totalIncome = () => {
        return incomes.reduce((acc, income) => acc + income.amount, 0);
    };

    // 💸 Add Expense
    const addExpense = async (expense) => {
        try {
            await axios.post(`${BASE_URL}add-expense`, expense);
            getExpenses();
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "Failed to add expense");
        }
    };

    // 📥 Get Expenses
    const getExpenses = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}get-expenses`);
            setExpenses(data);
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "Failed to fetch expenses");
        }
    };

    // 🗑️ Delete Expense
    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-expense/${id}`);
            getExpenses();
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "Failed to delete expense");
        }
    };

    const totalExpenses = () => {
        return expenses.reduce((acc, expense) => acc + expense.amount, 0);
    };

    const totalBalance = () => {
        return totalIncome() - totalExpenses();
    };

    const transactionHistory = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return history.slice(0, 3);
    };

    return (
        <GlobalContext.Provider
            value={{
                addIncome,
                getIncomes,
                incomes,
                deleteIncome,
                addExpense,
                getExpenses,
                expenses,
                deleteExpense,
                totalIncome,
                totalExpenses,
                totalBalance,
                transactionHistory,
                error,
                setError
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};
