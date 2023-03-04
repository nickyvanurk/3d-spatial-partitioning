import * as THREE from 'three';
import * as Utils from './helpers';
import { Fleet } from './fleet';
import { Station } from './station';
import { Context } from './types';

export class World {
    ctx: Context;
    station: Station;
    fleet: Fleet;

    constructor(ctx: Context) {
        this.ctx = ctx;

        ctx.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.setScalar(1);
        ctx.scene.add(dirLight);

        const stars = Utils.createPointCloudSphere(1000, 6000, 2000, 12.5, 0xffffff, false);
        ctx.scene.add(stars);

        this.station = new Station(ctx);
        this.station.position.y = 100;
        this.station.rotation.x = -0.05;
        this.station.rotation.z = -0.05;

        this.fleet = new Fleet(ctx, 50, 1000);
    }

    update(dt: number) {
        this.station.update(dt);
        this.fleet.update(dt);
    }

    render(alpha: number, dt: number) {
        this.station.render(alpha, dt);
        this.fleet.render(alpha);
    }
}
