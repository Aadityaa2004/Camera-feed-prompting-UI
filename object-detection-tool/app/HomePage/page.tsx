"use client";

import React from 'react';
import EntriesDisplay from '../components/EntriesDisplay';
// import PushDataForm from '../components/PushDataForm';
import FileDetails from '../components/FileDetails';

export default function Projects() {
    return (
        <>
            <HomePage />
        </>
    );
}

function HomePage() {
    const [selectedDeviceId, setSelectedDeviceId] = React.useState<string | null>(null);

    return (
        <div className="py-8">
            {/* <h1 className="text-xl font-bold mb-6">Object Detection Dashboard</h1> */}
            {/* <PushDataForm /> */}
            <EntriesDisplay />
            {selectedDeviceId && <FileDetails deviceId={selectedDeviceId} />}
            {/* <DeleteFileForm /> */}
        </div>
    );
}


