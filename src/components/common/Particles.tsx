import { useEffect, useRef, memo } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh } from 'ogl';
import './Particles.css';

interface ParticlesProps {
    particleCount?: number;
    particleSpread?: number;
    speed?: number;
    particleColors?: string[];
    moveParticlesOnHover?: boolean;
    particleHoverFactor?: number;
    alphaParticles?: boolean;
    particleBaseSize?: number;
    sizeRandomness?: number;
    cameraDistance?: number;
    disableRotation?: boolean;
    className?: string;
}

const DEFAULT_COLORS = ['#FFFAB5'];

const hexToRgb = (hex: string): [number, number, number] => {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
    const int = parseInt(hex, 16);
    return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255];
};

const vertex = `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;
  
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vRandom = random;
    vColor = color;
    
    vec3 pos = position * uSpread;
    pos.z *= 10.0;
    
    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    
    // Add organic movement
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
    
    vec4 mvPos = viewMatrix * mPos;
    
    // Size calculation based on distance and randomness
    gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = `
  precision highp float;
  
  uniform float uTime;
  uniform float uAlphaParticles;
  
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));
    
    // Soft glow effect
    // center is 0.0, edge is 0.5
    // smoothstep(edge, center, d) -> 1 at center, 0 at edge
    float glow = smoothstep(0.5, 0.0, d);
    
    // Sharpen core slightly to look like a particle
    glow = pow(glow, 2.0); 
    
    float alpha = glow * uAlphaParticles;
    
    if (d > 0.5) discard;
    
    gl_FragColor = vec4(vColor, alpha);
  }
`;

const Particles = memo(({
    particleCount = 200,
    particleSpread = 15,
    speed = 0.1,
    particleColors = DEFAULT_COLORS,
    moveParticlesOnHover = true,
    particleHoverFactor = 1,
    alphaParticles = true,
    particleBaseSize = 120, // Adjusted base size to be visible but not overwhelming
    sizeRandomness = 1,
    cameraDistance = 20,
    disableRotation = false,
    className = '',
}: ParticlesProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!containerRef.current) return;

        const renderer = new Renderer({
            alpha: true,
            depth: false,
            dpr: window.devicePixelRatio || 1,
        });

        const gl = renderer.gl;
        gl.clearColor(0, 0, 0, 0); // Transparent background

        const container = containerRef.current;
        container.appendChild(gl.canvas);

        const camera = new Camera(gl, { fov: 35 });
        camera.position.set(0, 0, cameraDistance);
        camera.lookAt([0, 0, 0]);

        // Create geometry data
        const count = particleCount;
        // We only need count vertices, acting as points
        const positions = new Float32Array(count * 3);
        const randoms = new Float32Array(count * 4);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            // Position: random localized distribution, expanded by uSpread in shader
            positions[i * 3] = (Math.random() - 0.5);
            positions[i * 3 + 1] = (Math.random() - 0.5);
            positions[i * 3 + 2] = (Math.random() - 0.5);

            // Random attributes for movement and size
            randoms[i * 4] = Math.random();
            randoms[i * 4 + 1] = Math.random();
            randoms[i * 4 + 2] = Math.random();
            randoms[i * 4 + 3] = Math.random();

            // Color
            const colorHex = particleColors[Math.floor(Math.random() * particleColors.length)];
            const rgb = hexToRgb(colorHex);
            colors[i * 3] = rgb[0];
            colors[i * 3 + 1] = rgb[1];
            colors[i * 3 + 2] = rgb[2];
        }

        const geometry = new Geometry(gl, {
            position: { size: 3, data: positions },
            random: { size: 4, data: randoms },
            color: { size: 3, data: colors },
        });

        const program = new Program(gl, {
            vertex,
            fragment,
            uniforms: {
                uTime: { value: 0 },
                uSpread: { value: particleSpread },
                uBaseSize: { value: particleBaseSize },
                uSizeRandomness: { value: sizeRandomness },
                uAlphaParticles: { value: alphaParticles ? 1.0 : 0.0 }, // If false, we set alpha to 0? Or should handle transparent? 
                // Re-reading prompt: "alphaParticles" prop likely controls opacity factor.
                // The user code snippet uses `uAlphaParticles`.
                // Assuming enable/disable visibility or multiplier.
                // Let's treat boolean true as 1.0 multiplier.
            },
            transparent: true,
            depthTest: false,
        });

        const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

        let animationId: number;
        let time = 0;

        const resize = () => {
            renderer.setSize(container.offsetWidth, container.offsetHeight);
            camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
        };

        window.addEventListener('resize', resize, false);
        resize();

        // Mouse flow
        const onMouseMove = (e: MouseEvent) => {
            // normalized mouse -1 to 1
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;

            mouseRef.current = { x, y };
        };

        if (moveParticlesOnHover) {
            window.addEventListener('mousemove', onMouseMove);
        }

        const update = () => {
            animationId = requestAnimationFrame(update);

            time += speed * 0.01; // Scale speed for reasonable movement
            program.uniforms.uTime.value = time;

            if (!disableRotation) {
                particles.rotation.y = Math.sin(time * 0.5) * 0.1;
                particles.rotation.x = Math.cos(time * 0.3) * 0.1;
            }

            if (moveParticlesOnHover) {
                // Subtle rotation based on mouse
                particles.rotation.x += (-mouseRef.current.y * 0.1 * particleHoverFactor - particles.rotation.x) * 0.1;
                particles.rotation.y += (mouseRef.current.x * 0.1 * particleHoverFactor - particles.rotation.y) * 0.1;
            }

            renderer.render({ scene: particles, camera });
        };

        animationId = requestAnimationFrame(update);

        return () => {
            window.removeEventListener('resize', resize);
            if (moveParticlesOnHover) {
                window.removeEventListener('mousemove', onMouseMove);
            }
            cancelAnimationFrame(animationId);
            if (container && gl.canvas && container.contains(gl.canvas)) {
                container.removeChild(gl.canvas);
            }
            // OGL standard disposal if needed, but for simple example often omitted. 
            // Ideally: geometry.remove(); program.remove();
        };
    }, [
        particleCount,
        particleSpread,
        speed,
        particleColors,
        moveParticlesOnHover,
        particleHoverFactor,
        alphaParticles,
        particleBaseSize,
        sizeRandomness,
        cameraDistance,
        disableRotation,
    ]);

    return <div ref={containerRef} className={`particles-container ${className}`} />;
});

export default Particles;
