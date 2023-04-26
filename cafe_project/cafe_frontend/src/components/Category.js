import React, {useEffect, useState} from 'react';
import CafeService from './CafeService';
import {useLocation, useParams} from "react-router-dom";

const cafeService = new CafeService();


export default function Category() {

    const {meal_category} = useParams();
    const {state} = useLocation();
    const [meals, setMeals] = useState([]);


    useEffect(() => {
        cafeService.getMealCategory(meal_category).then(function (result) {
            console.log(result);
            setMeals(result);
        })
    }, [meal_category]);

    return (
        <div className='meals'>
            <h2>{state}</h2>
                {meals.map((meal) =>
                    <a className='meal-link' key={meal.id} href={`/${meal_category}/${meal.id}`}>
                    <div className="meal-photo">
                        <img src={meal.photos[0].image} alt=""/>
                        <p>{meal.name}</p>
                    </div>
                    </a>)
                }
        </div>
    );
}