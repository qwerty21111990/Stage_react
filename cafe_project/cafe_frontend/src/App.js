import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Menu from "./components/Menu";
import Top from "./components/Top";
import Category from "./components/Category";
import MealDetail from "./components/MealDetail";
import Statistics from "./components/Statistics";
import CategoryStatistics from "./components/CategoryStatistics";
import MealChart from "./components/MealChart";
import {Login} from "./components/Login";
import {RequireAuth} from "./hogs/RequireAuth";
import {AuthProvider} from "./hogs/AuthProvider";
import Registration from "./components/Registration";


function BaseLayout() {

    return (
        <div className="wrapper">
            <Top/>
            <div className="content">
                <Routes>
                    <Route path='/' element={<Menu/>}/>
                    <Route path='/:meal_category' element={<Category/>}/>
                    <Route path='/:meal_category/:id' element={<MealDetail/>}/>
                    <Route path='login' element={<Login/>}/>
                    <Route path='registration' element={<Registration/>}/>
                    <Route path='/statistics' element={
                        <RequireAuth>
                            <Statistics/>
                        </RequireAuth>}/>
                    <Route path='/category_statistics' element={
                        <RequireAuth>
                            <CategoryStatistics/>
                        </RequireAuth>}/>
                    <Route path='/meal_statistics/:id' element={
                        <RequireAuth>
                            <MealChart/>
                        </RequireAuth>}/>
                </Routes>
            </div>
            <footer>
                Все права защищены &copy;
            </footer>
        </div>
    )
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <BaseLayout/>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;