import React from 'react';
import Slider from './Slider';
import FeaturesSection from './FeaturesSection';
import RealTimeRequests from './RealTimeRequests';
import MembershipSection from './MembershipSection';
import MealsTabs from './MealsTabs';
import SalesPromotion from './SalesPromotion';
import Promotion from './Promotion';
const Home = () => {
    return (
        <div>
            <Slider></Slider>
           <MealsTabs></MealsTabs>
            <FeaturesSection></FeaturesSection>
             <MembershipSection></MembershipSection>
              <SalesPromotion></SalesPromotion>
            <RealTimeRequests></RealTimeRequests>
              <Promotion></Promotion>
        </div>
    );
};

export default Home;