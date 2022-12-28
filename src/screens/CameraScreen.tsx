import VideoCamera from '../components/VideoCamera';

declare type PropWithEventID = {
    route: { params: { eventID: string } };
};

function CameraScreen({ route }: PropWithEventID) {
    const eventID = route.params.eventID;
    console.log('Event ID in Props: ', eventID);
    return <VideoCamera eventID={route.params.eventID} onFinish={(_) => true} />;
}

export default CameraScreen;
