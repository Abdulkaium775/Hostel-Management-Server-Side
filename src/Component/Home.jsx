import React from 'react';
import Slider from './Slider';
import FeaturesSection from './FeaturesSection';
import RealTimeRequests from './RealTimeRequests';
import MembershipSection from './MembershipSection';

const Home = () => {
    return (
        <div>
            <Slider></Slider>
            <FeaturesSection></FeaturesSection>
            <RealTimeRequests></RealTimeRequests>
            <MembershipSection></MembershipSection>
        </div>
    );
};

export default Home;