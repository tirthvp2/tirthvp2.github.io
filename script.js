console.log("Welcome to Tirth Patel's Portfolio!");

// Smooth Page Transitions
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        document.body.style.opacity = 0;
        document.body.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            window.location.href = href;
        }, 500);
    });
});

// Fade-in Effect on Page Load
window.addEventListener('load', () => {
    document.body.style.opacity = 0;
    setTimeout(() => {
        document.body.style.opacity = 1;
        document.body.style.transition = 'opacity 0.5s ease';
    }, 100);
});

// Scroll-to-Top Button
const scrollBtn = document.createElement('button');
scrollBtn.textContent = '▲ Top';
scrollBtn.className = 'scroll-top';
document.body.appendChild(scrollBtn);

scrollBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollBtn.style.opacity = 1;
        scrollBtn.style.visibility = 'visible';
    } else {
        scrollBtn.style.opacity = 0;
        scrollBtn.style.visibility = 'hidden';
    }
});

// Hover Animations for Jobs, Projects, Education, and Showcase Items
document.querySelectorAll('.job, .project, .education, .showcase-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-5px)';
        item.style.boxShadow = '0 8px 16px rgba(229, 9, 20, 0.3)';
    });
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0)';
        item.style.boxShadow = 'none';
    });
});

// Dark/Light Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        themeToggle.textContent = document.body.classList.contains('light-mode') ? '🌞' : '🌙';
        localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
        updateChartColors();
    });

    // Load Theme Preference on Page Load
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.textContent = '🌞';
    } else {
        themeToggle.textContent = '🌙';
    }
}

// Interactive Chart (Chart.js) on Index Page
let dataChart;

if (document.getElementById('dataChart')) {
    const ctx = document.getElementById('dataChart').getContext('2d');
    const isLightMode = document.body.classList.contains('light-mode');
    const labelColor = isLightMode ? '#333' : '#fff';

    dataChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Python', 'SQL', 'Tableau', 'Java', 'C++'],
            datasets: [{
                label: 'Proficiency Level',
                data: [90, 85, 80, 70, 65],
                backgroundColor: 'rgba(229, 9, 20, 0.6)',
                borderColor: '#e50914',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        color: labelColor
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: labelColor
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: labelColor
                    }
                }
            }
        }
    });
}

// 3D Model Viewer (Three.js) on Index Page
if (document.getElementById('modelViewer')) {
    try {
        const container = document.getElementById('modelViewer');
        if (!container) {
            console.error("Model Viewer container not found!");
        } else {
            const width = container.clientWidth;
            const height = 300;

            // Scene setup
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(width, height);
            container.appendChild(renderer.domElement);

            // Add lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
            directionalLight.position.set(1, 1, 1).normalize();
            scene.add(directionalLight);

            // Load the GLTF model
            if (typeof THREE.GLTFLoader === 'undefined') {
                console.error("GLTFLoader not loaded!");
            } else {
                const loader = new THREE.GLTFLoader();
                loader.load(
                    'models/spacesuit.glb', // Path to your GLTF model
                    (gltf) => {
                        const model = gltf.scene;
                        // Adjust the model’s scale and position if needed
                        model.scale.set(1, 1, 1); // Adjust scale as needed
                        model.position.set(0, 0, 0); // Center the model
                        scene.add(model);

                        // Add OrbitControls
                        if (typeof THREE.OrbitControls === 'undefined') {
                            console.error("OrbitControls not loaded!");
                        } else {
                            const controls = new THREE.OrbitControls(camera, renderer.domElement);
                            controls.enableDamping = true;
                            controls.dampingFactor = 0.05;
                            controls.screenSpacePanning = false;
                            controls.minDistance = 2;
                            controls.maxDistance = 10;

                            camera.position.z = 3;

                            // Handle window resize
                            window.addEventListener('resize', () => {
                                const newWidth = container.clientWidth;
                                camera.aspect = newWidth / height;
                                camera.updateProjectionMatrix();
                                renderer.setSize(newWidth, height);
                            });

                            // Animation loop
                            const animate = () => {
                                requestAnimationFrame(animate);
                                controls.update();
                                renderer.render(scene, camera);
                            };
                            animate();
                        }
                    },
                    (xhr) => {
                        // Progress callback
                        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                    },
                    (error) => {
                        console.error('An error occurred while loading the GLTF model:', error);
                    }
                );
            }
        }
    } catch (error) {
        console.error("Error initializing 3D Model Viewer:", error);
    }
}
// Python Demo (Pyodide) on Index Page
async function runPythonDemo() {
    try {
        const outputDiv = document.getElementById('pythonOutput');
        if (!outputDiv) {
            console.error("Python output div not found!");
            return;
        }
        outputDiv.textContent = 'Generating Sierpinski Triangle...\n';

        let pyodide = await loadPyodide();
        if (!pyodide) {
            outputDiv.textContent = 'Error: Pyodide failed to load.';
            return;
        }

        const pythonCode = `
def sierpinski(n):
    if n == 0:
        return ['*']
    smaller = sierpinski(n - 1)
    width = len(smaller[0])
    space = ' ' * (width // 2)
    result = []
    for line in smaller:
        result.append(space + line + space)
    for line in smaller:
        result.append(line + ' ' + line)
    return result

# Generate Sierpinski Triangle with depth 3
triangle = sierpinski(3)
'\\n'.join(triangle)
        `;

        const result = await pyodide.runPythonAsync(pythonCode);
        outputDiv.textContent = result;
    } catch (error) {
        const outputDiv = document.getElementById('pythonOutput');
        outputDiv.textContent = `Error: ${error.message}`;
        console.error("Python Demo Error:", error);
    }
}

// Skills Radar Chart (Chart.js) on Extras Page
let skillsChart;

const updateChartColors = () => {
    const isLightMode = document.body.classList.contains('light-mode');
    const labelColor = isLightMode ? '#333' : '#fff';
    const gridColor = isLightMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';

    // Update Data Chart on Index Page
    if (document.getElementById('dataChart') && dataChart) {
        dataChart.options.scales.x.ticks.color = labelColor;
        dataChart.options.scales.y.ticks.color = labelColor;
        dataChart.options.plugins.legend.labels.color = labelColor;
        dataChart.update();
    }

    // Update Skills Radar Chart on Extras Page
    if (document.getElementById('skillsRadarChart')) {
        if (skillsChart) {
            // Update existing chart
            skillsChart.options.scales.r.ticks.color = labelColor;
            skillsChart.options.scales.r.pointLabels.color = labelColor;
            skillsChart.options.scales.r.grid.color = gridColor;
            skillsChart.options.scales.r.angleLines.color = gridColor;
            skillsChart.options.plugins.legend.labels.color = labelColor;
            skillsChart.update();
        } else {
            // Create new chart
            const ctx = document.getElementById('skillsRadarChart').getContext('2d');
            skillsChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['Python', 'SQL', 'Tableau', 'Java', 'C++', 'Hardware'],
                    datasets: [{
                        label: 'Skill Proficiency',
                        data: [90, 85, 80, 70, 65, 75],
                        backgroundColor: 'rgba(229, 9, 20, 0.2)',
                        borderColor: '#e50914',
                        borderWidth: 2,
                        pointBackgroundColor: '#e50914'
                    }]
                },
                options: {
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                stepSize: 20,
                                color: labelColor
                            },
                            pointLabels: {
                                color: labelColor
                            },
                            grid: {
                                color: gridColor
                            },
                            angleLines: {
                                color: gridColor
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: labelColor
                            }
                        }
                    }
                }
            });
        }
    }
};

// Initialize charts on page load
document.addEventListener('DOMContentLoaded', () => {
    updateChartColors();
});

// Contact Form Validation
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (name && email && message) {
            alert('Thank you for your message! I’ll get back to you soon.');
            contactForm.reset();
        } else {
            alert('Please fill out all fields.');
        }
    });
}