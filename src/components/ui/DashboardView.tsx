"use client"

import React, { useEffect } from 'react'

const DashboardView = () => {
    useEffect(() => {

        const originalBg = document.body.style.backgroundColor;


        document.body.style.backgroundColor = '#103663';


        return () => {
            document.body.style.backgroundColor = originalBg;
        };
    }, []);



    return (
        <main className="flex h-screen">
            <section className="w-1/4 bg-[#103663] flex items-center justify-center">
                <div className="text-white font-extralight text-9xl leading-tight whitespace-pre-line text-center ml-5">
                    Bienv{'\n'}enido{'\n'}de{'\n'}nuevo
                </div>
            </section>


            <section className="w-3/4 bg-[#4A77A8] mt-30 ml-10 p-8 rounded-tl-[50px]">

            </section>
        </main>
    );
}

export default DashboardView
