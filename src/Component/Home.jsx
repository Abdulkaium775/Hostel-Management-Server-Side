import React from 'react';
import Slider from './Slider';
import FeaturesSection from './FeaturesSection';
import RealTimeRequests from './RealTimeRequests';

const Home = () => {
    return (
        <div>
            <Slider></Slider>
            <FeaturesSection></FeaturesSection>
            <RealTimeRequests></RealTimeRequests>
        </div>
    );
};

export default Home;