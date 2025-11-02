// OCEAN Personality Dimensions Interactive Infographic
// Main JavaScript file with D3.js visualizations

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all visualizations
    initOceanVisualization();
    initDimensionVisualizations();
    initEvidenceCharts();
    initInteractiveFeatures();
    initScrollAnimations();
});

// OCEAN Model Main Visualization
function initOceanVisualization() {
    const container = d3.select('#ocean-visualization');
    const width = parseInt(container.style('width'));
    const height = 400;
    const radius = Math.min(width, height) / 2 - 50;

    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width/2}, ${height/2})`);

    // OCEAN data
    const data = [
        { label: 'Openness', value: 20, color: '#e74c3c', description: 'Apertura a la Experiencia' },
        { label: 'Conscientiousness', value: 20, color: '#f39c12', description: 'Escrupulosidad' },
        { label: 'Extraversion', value: 20, color: '#f1c40f', description: 'Extraversión' },
        { label: 'Agreeableness', value: 20, color: '#2ecc71', description: 'Afabilidad/Empatía' },
        { label: 'Neuroticism', value: 20, color: '#9b59b6', description: 'Neuroticismo (vs. Estabilidad)' }
    ];

    const pie = d3.pie()
        .value(d => d.value)
        .sort(null);

    const arc = d3.arc()
        .innerRadius(radius * 0.4)
        .outerRadius(radius);

    const arcHover = d3.arc()
        .innerRadius(radius * 0.4)
        .outerRadius(radius * 1.1);

    // Create tooltip
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    // Draw arcs
    const arcs = svg.selectAll('.arc')
        .data(pie(data))
        .enter().append('g')
        .attr('class', 'arc');

    arcs.append('path')
        .attr('class', 'arc-path')
        .attr('d', arc)
        .attr('fill', d => d.data.color)
        .on('mouseover', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('d', arcHover);
            
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html(`<strong>${d.data.label}</strong><br/>${d.data.description}`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function(d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('d', arc);
            
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        })
        .on('click', function(event, d) {
            // Scroll to corresponding dimension
            const dimensionId = d.data.label.toLowerCase();
            const element = document.querySelector(`[data-dimension="${getDimensionMapping(dimensionId)}"]`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        });

    // Add text labels
    arcs.append('text')
        .attr('class', 'arc-text')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('dy', '.35em')
        .text(d => d.data.label.charAt(0));

    // Center text
    svg.append('text')
        .attr('class', 'center-text')
        .attr('dy', '-0.5em')
        .style('font-size', '24px')
        .text('OCEAN');

    svg.append('text')
        .attr('class', 'center-text')
        .attr('dy', '1em')
        .style('font-size', '14px')
        .text('Big Five Model');
}

// Individual dimension visualizations
function initDimensionVisualizations() {
    createDimensionChart('agreeableness-viz', 'Afabilidad', [
        { aspect: 'Cooperación', value: 85 },
        { aspect: 'Confianza', value: 78 },
        { aspect: 'Cordialidad', value: 82 },
        { aspect: 'Conciliación', value: 80 }
    ], '#2ecc71');

    createDimensionChart('neuroticism-viz', 'Estabilidad Emocional', [
        { aspect: 'Regulación Emocional', value: 88 },
        { aspect: 'Resistencia al Estrés', value: 75 },
        { aspect: 'Calma bajo Presión', value: 82 },
        { aspect: 'Claridad Cognitiva', value: 85 }
    ], '#9b59b6');

    createDimensionChart('extraversion-viz', 'Extraversión', [
        { aspect: 'Energía Social', value: 90 },
        { aspect: 'Asertividad', value: 85 },
        { aspect: 'Comunicación', value: 92 },
        { aspect: 'Presencia Pública', value: 87 }
    ], '#f1c40f');

    createDimensionChart('conscientiousness-viz', 'Escrupulosidad', [
        { aspect: 'Organización', value: 95 },
        { aspect: 'Disciplina', value: 88 },
        { aspect: 'Orientación a Objetivos', value: 90 },
        { aspect: 'Persistencia', value: 85 }
    ], '#f39c12');

    createDimensionChart('openness-viz', 'Apertura', [
        { aspect: 'Curiosidad', value: 88 },
        { aspect: 'Creatividad', value: 85 },
        { aspect: 'Innovación', value: 82 },
        { aspect: 'Adaptabilidad', value: 80 }
    ], '#e74c3c');
}

function createDimensionChart(containerId, title, data, color) {
    const container = d3.select(`#${containerId}`);
    const width = parseInt(container.style('width'));
    const height = 200;
    const margin = { top: 20, right: 30, bottom: 40, left: 80 };

    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width - margin.left - margin.right]);

    const yScale = d3.scaleBand()
        .domain(data.map(d => d.aspect))
        .range([0, height - margin.top - margin.bottom])
        .padding(0.2);

    // Create tooltip for dimension charts
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    // Add bars
    g.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'chart-bar')
        .attr('x', 0)
        .attr('y', d => yScale(d.aspect))
        .attr('width', 0)
        .attr('height', yScale.bandwidth())
        .attr('fill', color)
        .attr('rx', 4)
        .on('mouseover', function(event, d) {
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html(`<strong>${d.aspect}</strong><br/>Puntuación: ${d.value}/100`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function(d) {
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        })
        .transition()
        .duration(1000)
        .delay((d, i) => i * 200)
        .attr('width', d => xScale(d.value));

    // Add value labels
    g.selectAll('.value-label')
        .data(data)
        .enter().append('text')
        .attr('class', 'value-label')
        .attr('x', d => xScale(d.value) + 5)
        .attr('y', d => yScale(d.aspect) + yScale.bandwidth()/2)
        .attr('dy', '.35em')
        .style('font-size', '12px')
        .style('fill', '#666')
        .style('opacity', 0)
        .text(d => d.value + '%')
        .transition()
        .duration(1000)
        .delay((d, i) => i * 200 + 500)
        .style('opacity', 1);

    // Add y-axis
    g.append('g')
        .attr('class', 'chart-axis')
        .call(d3.axisLeft(yScale));

    // Add x-axis
    g.append('g')
        .attr('class', 'chart-axis')
        .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
        .call(d3.axisBottom(xScale).tickFormat(d => d + '%'));
}

// Evidence charts
function initEvidenceCharts() {
    createCorrelationChart();
    createHeritabilityChart();
}

function createCorrelationChart() {
    const container = d3.select('#correlation-chart');
    const width = parseInt(container.style('width'));
    const height = 250;
    const margin = { top: 20, right: 30, bottom: 60, left: 100 };

    const data = [
        { dimension: 'Extraversión', correlation: 0.31 },
        { dimension: 'Escrupulosidad', correlation: 0.28 },
        { dimension: 'Apertura', correlation: 0.24 },
        { dimension: 'Estabilidad Emocional', correlation: 0.22 },
        { dimension: 'Afabilidad', correlation: 0.08 }
    ];

    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear()
        .domain([0, 0.35])
        .range([0, width - margin.left - margin.right]);

    const yScale = d3.scaleBand()
        .domain(data.map(d => d.dimension))
        .range([0, height - margin.top - margin.bottom])
        .padding(0.2);

    const colors = ['#f1c40f', '#f39c12', '#e74c3c', '#9b59b6', '#2ecc71'];

    // Add bars
    g.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'chart-bar')
        .attr('x', 0)
        .attr('y', d => yScale(d.dimension))
        .attr('width', 0)
        .attr('height', yScale.bandwidth())
        .attr('fill', (d, i) => colors[i])
        .attr('rx', 4)
        .transition()
        .duration(1000)
        .delay((d, i) => i * 200)
        .attr('width', d => xScale(d.correlation));

    // Add value labels
    g.selectAll('.value-label')
        .data(data)
        .enter().append('text')
        .attr('class', 'value-label')
        .attr('x', d => xScale(d.correlation) + 5)
        .attr('y', d => yScale(d.dimension) + yScale.bandwidth()/2)
        .attr('dy', '.35em')
        .style('font-size', '12px')
        .style('fill', '#666')
        .style('opacity', 0)
        .text(d => 'r = ' + d.correlation.toFixed(2))
        .transition()
        .duration(1000)
        .delay((d, i) => i * 200 + 500)
        .style('opacity', 1);

    // Add axes
    g.append('g')
        .attr('class', 'chart-axis')
        .call(d3.axisLeft(yScale));

    g.append('g')
        .attr('class', 'chart-axis')
        .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format('.2f')));

    // Add axis labels
    g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height - margin.top - margin.bottom) / 2)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('fill', '#666')
        .text('Dimensiones de Personalidad');

    g.append('text')
        .attr('transform', `translate(${(width - margin.left - margin.right) / 2}, ${height - margin.top - margin.bottom + 40})`)
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('fill', '#666')
        .text('Correlación con Liderazgo Efectivo');
}

function createHeritabilityChart() {
    const container = d3.select('#heritability-chart');
    const width = parseInt(container.style('width'));
    const height = 250;

    const data = [
        { category: 'Hereditario', value: 50, color: '#3498db' },
        { category: 'Ambiental', value: 50, color: '#2ecc71' }
    ];

    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);

    const radius = Math.min(width, height) / 2 - 20;
    const g = svg.append('g')
        .attr('transform', `translate(${width/2}, ${height/2})`);

    const pie = d3.pie()
        .value(d => d.value)
        .sort(null);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    const arcs = g.selectAll('.arc')
        .data(pie(data))
        .enter().append('g')
        .attr('class', 'arc');

    arcs.append('path')
        .attr('d', arc)
        .attr('fill', d => d.data.color)
        .style('opacity', 0)
        .transition()
        .duration(1000)
        .style('opacity', 1);

    arcs.append('text')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('dy', '.35em')
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .style('fill', 'white')
        .style('opacity', 0)
        .text(d => d.data.value + '%')
        .transition()
        .duration(1000)
        .delay(500)
        .style('opacity', 1);

    // Add legend
    const legend = svg.append('g')
        .attr('transform', `translate(${width - 120}, 20)`);

    const legendItems = legend.selectAll('.legend-item')
        .data(data)
        .enter().append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(0, ${i * 25})`);

    legendItems.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', d => d.color);

    legendItems.append('text')
        .attr('x', 20)
        .attr('y', 12)
        .style('font-size', '12px')
        .style('fill', '#666')
        .text(d => d.category);
}

// Interactive features
function initInteractiveFeatures() {
    // Smooth scrolling for navigation
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Dimension card interactions
    document.querySelectorAll('.dimension-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add interactive highlights to key terms
    highlightKeyTerms();
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animations
    document.querySelectorAll('.dimension-card, .evidence-box, .conclusion-item').forEach(el => {
        observer.observe(el);
    });
}

function highlightKeyTerms() {
    const keyTerms = [
        'OCEAN', 'Big Five', 'extraversión', 'escrupulosidad', 
        'apertura', 'afabilidad', 'neuroticismo', 'liderazgo'
    ];

    // This would highlight key terms in the text
    // Implementation would involve finding and wrapping terms in spans with special styling
}

// Utility functions
function getDimensionMapping(dimension) {
    const mapping = {
        'openness': 'openness',
        'conscientiousness': 'conscientiousness',
        'extraversion': 'extraversion',
        'agreeableness': 'agreeableness',
        'neuroticism': 'neuroticism'
    };
    return mapping[dimension] || dimension;
}

// Resize handler for responsive charts
window.addEventListener('resize', function() {
    // Redraw visualizations on window resize
    d3.selectAll('svg').remove();
    setTimeout(() => {
        initOceanVisualization();
        initDimensionVisualizations();
        initEvidenceCharts();
    }, 100);
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initOceanVisualization,
        initDimensionVisualizations,
        initEvidenceCharts,
        initInteractiveFeatures
    };
}