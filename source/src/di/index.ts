import { Container } from "./container";

export class DiContainer {
    private static instance: Container;

    public static getInstance(): Container {
        if (!DiContainer.instance) {
            DiContainer.instance = new Container();
        }

        return DiContainer.instance;
    }
}
