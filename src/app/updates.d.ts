declare namespace __esri {
    interface Portal extends Accessor, Loadable {
        staticImagesUrl?: string;
    }
    type BackwardsCompatibleFirst = boolean;
    type DateFormat = {
        properties: string[];
        formatter: string;
    };

}