import React, {useEffect, useState} from 'react';
import CafeService from './CafeService';
import {Link} from "react-router-dom";

const cafeService = new CafeService();


export default function Menu() {

    const [mealCategories, setMealCategories] = useState([])

    useEffect(() => {
        cafeService.getMenu().then(function (result) {
            console.log(result);
            setMealCategories(result);
        })
    },);

    return (
        <div className='home'>
            <header>
                <div className='presentation'></div>
            </header>
            <h3>Приветствуем Вас в нашем кафе.<br/> Знакомьтесь с меню, выбирайте и наслаждайтесь вкусом</h3>
            <div className='menu'>
                {mealCategories.map((category, index) =>
                    <Link className='menu-link' key={index} state={category[0]} to={`/${category[1]}`}>{category[0]}</Link>)
                    // <a className='menu-link' key={index} href={`/meals/${category[1]}`} onClick=>
                    //     {category[0]}
                    // </a>)
                }
            </div>
        </div>
    );
}