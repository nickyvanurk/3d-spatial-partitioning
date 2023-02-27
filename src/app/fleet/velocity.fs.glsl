uniform float delta;

const float width = resolution.x;
const float height = resolution.y;

const float PI = 3.141592653589793;
const float PI_2 = PI * 2.0;

float zoneRadius = 40.0;
float zoneRadiusSquared = 1600.0;
float separationThresh = 0.45;
float alignmentThresh = 0.65;

float separationDistance = 20.0;
float alignmentDistance = 20.0;
float cohesionDistance = 20.0;

const float SPEED_LIMIT = 50.0;

void main() {
    zoneRadius = separationDistance + alignmentDistance + cohesionDistance;
    separationThresh = separationDistance / zoneRadius;
    alignmentThresh = (separationDistance + alignmentDistance) / zoneRadius;
    zoneRadiusSquared = zoneRadius * zoneRadius;

    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 position = texture2D(texturePosition, uv).xyz;
    vec3 velocity = texture2D(textureVelocity, uv).xyz;

    // Attract fleet to center
    vec3 central = vec3(0.0, 0.0, 0.0);
    vec3 dir = position - central;
    dir.y *= 2.5;
    velocity -= normalize(dir) * delta * 5.0;

    vec3 shipPosition, shipVelocity;
    float dist, distSquared, percent, f;

    for (float y = 0.0; y < height; y++) {
        for (float x = 0.0; x < width; x++) {
            vec2 ref = vec2(x + 0.5, y + 0.5) / resolution.xy;
            shipPosition = texture2D(texturePosition, ref).xyz;

            dir = shipPosition - position;
            dist = length(dir);

            if (dist < 0.0001) continue;

            distSquared = dist * dist;

            if (distSquared > zoneRadiusSquared) continue;

            percent = distSquared / zoneRadiusSquared;

            if (percent < separationThresh) {
                // Separation - move apart for comfort
                f = (separationThresh / percent - 1.0) * delta;
                velocity -= normalize(dir) * f;
            } else if (percent < alignmentThresh) {
                // Alignment - fly the same direction
                float threshDelta = alignmentThresh - separationThresh;
                float adjustPercent = (percent - separationThresh) / threshDelta;
                shipVelocity = texture2D(textureVelocity, ref).xyz;
                f = (0.5 - cos(adjustPercent * PI_2) * 0.5 + 0.5) * delta;
                velocity += normalize(shipVelocity) * f;
            } else {
                // Cohesion - move closer
                float threshDelta = 1.0 - alignmentThresh;
                float adjustPercent;
                if (threshDelta == 0.0) adjustPercent = 1.0;
                else adjustPercent = (percent - alignmentThresh) / threshDelta;
                f = (0.5 - (cos(adjustPercent * PI_2) * -0.5 + 0.5)) * delta;
                velocity += normalize(dir) * f;
            }
        }
    }

    if (length(velocity) > SPEED_LIMIT) {
        velocity = normalize(velocity) * SPEED_LIMIT;
    }

    gl_FragColor = vec4(velocity , 1.0);
}