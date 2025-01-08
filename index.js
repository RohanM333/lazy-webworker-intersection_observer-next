// pages/index.js
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useInView } from 'react-intersection-observer';

// Lazy load components
const Component1 = dynamic(() => import('../components/Component1'));
const Component2 = dynamic(() => import('../components/Component2'));
const Component3 = dynamic(() => import('../components/Component3'));
const Component4 = dynamic(() => import('../components/Component4'));
const Component5 = dynamic(() => import('../components/Component5'));

const worker = new Worker(new URL('../worker.js', import.meta.url));

const Home = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState({});

    const fetchData = (componentId, url) => {
        worker.postMessage({ apiUrl: url });

        worker.onmessage = (event) => {
            const { data: responseData, error } = event.data;
            if (error) {
                console.error(`Error fetching data for component ${componentId}:`, error);
            } else {
                setData((prevData) => ({ ...prevData, [componentId]: responseData }));
                setLoading((prevLoading) => ({ ...prevLoading, [componentId]: false }));
            }
        };
    };

    const handleInView = (inView, componentId, url) => {
        if (inView && !data[componentId]) {
            setLoading((prevLoading) => ({ ...prevLoading, [componentId]: true }));
            fetchData(componentId, url);
        }
    };

    const { ref: ref1, inView: inView1 } = useInView({ triggerOnce: true });
    const { ref: ref2, inView: inView2 } = useInView({ triggerOnce: true });
    const { ref: ref3, inView: inView3 } = useInView({ triggerOnce: true });
    const { ref: ref4, inView: inView4 } = useInView({ triggerOnce: true });
    const { ref: ref5, inView: inView5 } = useInView({ triggerOnce: true });

    useEffect(() => {
        if (inView1) handleInView(inView1, 1, 'https://api.example.com/endpoint1');
        if (inView2) handleInView(inView2, 2, 'https://api.example.com/endpoint2');
        if (inView3) handleInView(inView3, 3, 'https://api.example.com/endpoint3');
        if (inView4) handleInView(inView4, 4, 'https://api.example.com/endpoint4');
        if (inView5) handleInView(inView5, 5, 'https://api.example.com/endpoint5');
    }, [inView1, inView2, inView3, inView4, inView5]);

    return (
        <div>
            <div ref={ref1}>
                {loading[1] ? 'Loading Component 1...' : data[1] && <Component1 data={data[1]} />}
            </div>
            <div ref={ref2}>
                {loading[2] ? 'Loading Component 2...' : data[2] && <Component2 data={data[2]} />}
            </div>
            <div ref={ref3}>
                {loading[3] ? 'Loading Component 3...' : data[3] && <Component3 data={data[3]} />}
            </div>
            <div ref={ref4}>
                {loading[4] ? 'Loading Component 4...' : data[4] && <Component4 data={data[4]} />}
            </div>
            <div ref={ref5}>
                {loading[5] ? 'Loading Component 5...' : data[5] && <Component5 data={data[5]} />}
            </div>
        </div>
    );
};

export default Home;
