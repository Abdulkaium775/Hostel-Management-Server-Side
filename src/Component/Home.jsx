import React from 'react';
import Slider from './Slider';
import FeaturesSection from './FeaturesSection';
import RealTimeRequests from './RealTimeRequests';
import MembershipSection from './MembershipSection';
import MealsTabs from './MealsTabs';

const Home = () => {
    return (
        <div>
            <Slider></Slider>
           <MealsTabs></MealsTabs>
            <FeaturesSection></FeaturesSection>
            <RealTimeRequests></RealTimeRequests>
            <MembershipSection></MembershipSection>
        </div>
    );
};

export default Home;