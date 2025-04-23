// Constantes COCOMO por tipo de proyecto
const cocomoConstants = {
    organic: { a: 3.2, b: 1.05, c: 2.5, d: 0.38 },
    'semi-detached': { a: 3.0, b: 1.12, c: 2.5, d: 0.35 },
    embedded: { a: 2.8, b: 1.20, c: 2.5, d: 0.32 }
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar fecha actual en el footer
    const currentDateElement = document.getElementById('current-date');
    const currentDate = new Date();
    currentDateElement.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;

    // Manejo de pestañas
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remover clase active de todas las pestañas
            tabs.forEach(t => t.classList.remove('active'));
            
            // Agregar clase active a la pestaña clickeada
            this.classList.add('active');
            
            // Ocultar todos los contenidos
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Mostrar el contenido correspondiente
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // Manejo del modo de cálculo
    const calculationMode = document.getElementById('calculation-mode');
    const teamInput = document.getElementById('team-input');
    const durationInput = document.getElementById('duration-input');
    
    calculationMode.addEventListener('change', function() {
        teamInput.style.display = 'none';
        durationInput.style.display = 'none';
        
        switch(this.value) {
            case 'team':
                teamInput.style.display = 'block';
                break;
            case 'duration':
                durationInput.style.display = 'block';
                break;
        }
    });

    // Función para calcular el EAF (Producto de todos los factores)
    function calculateEAF() {
        let eaf = 1.0;
        document.querySelectorAll('.factor').forEach(select => {
            const value = parseFloat(select.value);
            if (!isNaN(value)) {
                eaf *= value;
            }
        });
        return eaf;
    }

    // Función para calcular el costo considerando incrementos anuales
    function calculateTotalCost(effort, duration, salary) {
        if (salary <= 0 || isNaN(salary)) return 0;
        
        let totalCost = 0;
        let remainingMonths = duration;
        let currentYear = 1;
        const annualIncrease = 0.05; // 5% anual
        const programmersNeeded = effort / duration;
        
        while (remainingMonths > 0) {
            const monthsThisYear = Math.min(12, remainingMonths);
            const yearlySalary = salary * Math.pow(1 + annualIncrease, currentYear - 1);
            const costThisYear = programmersNeeded * monthsThisYear * yearlySalary;
            
            totalCost += costThisYear;
            remainingMonths -= monthsThisYear;
            currentYear++;
        }
        
        return totalCost;
    }

    // Función para formatear dinero
    function formatMoney(amount) {
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    }

    // Función para generar el detalle de costos de forma segura
    function generateCostDetail(effort, duration, salary) {
        if (salary <= 0 || isNaN(salary)) {
            return document.createTextNode('No se calculó el costo porque el salario no fue especificado');
        }
        
        const detailContainer = document.createElement('div');
        const title = document.createElement('p');
        title.textContent = 'Detalle de costos por año:';
        detailContainer.appendChild(title);
        
        const list = document.createElement('ul');
        let remainingMonths = duration;
        let currentYear = 1;
        const annualIncrease = 0.05;
        const programmersNeeded = effort / duration;
        
        while (remainingMonths > 0) {
            const monthsThisYear = Math.min(12, remainingMonths);
            const yearlySalary = salary * Math.pow(1 + annualIncrease, currentYear - 1);
            const costThisYear = programmersNeeded * monthsThisYear * yearlySalary;
            
            const item = document.createElement('li');
            item.textContent = `Año ${currentYear}: ${monthsThisYear} meses, ${programmersNeeded.toFixed(1)} programadores, ` +
                               `salario ${formatMoney(yearlySalary)}/mes → ${formatMoney(costThisYear)}`;
            list.appendChild(item);
            
            remainingMonths -= monthsThisYear;
            currentYear++;
        }
        
        detailContainer.appendChild(list);
        return detailContainer;
    }

    // Función para mostrar resultados
    function displayResults(results) {
        const resultsContainer = document.getElementById('results-content');
        resultsContainer.innerHTML = '';
        
        const resultTypes = [
            { id: 'type', label: 'Tipo de proyecto', value: results.projectType },
            { id: 'kloc', label: 'Tamaño del proyecto', value: `${results.kloc} KLOC (${results.kloc * 1000} líneas de código)` },
            { id: 'eaf', label: 'Factor de ajuste de esfuerzo (EAF)', value: results.eaf.toFixed(3) },
            { id: 'effort', label: 'Esfuerzo estimado', value: `${results.effort.toFixed(1)} persona-mes` },
            { id: 'duration', label: 'Duración estimada', value: `${results.duration.toFixed(1)} meses (${(results.duration / 12).toFixed(1)} años)` },
            { id: 'team', label: 'Tamaño del equipo', value: `${results.teamSize.toFixed(1)} programadores` },
            { id: 'productivity', label: 'Productividad', value: `${(results.kloc / results.effort).toFixed(2)} KLOC/persona-mes` },
            { id: 'cost', label: 'Costo total estimado', value: results.salary > 0 ? formatMoney(results.totalCost) : 'No calculado' }
        ];
        
        resultTypes.forEach(item => {
            const div = document.createElement('div');
            div.className = 'result-item';
            
            const label = document.createElement('span');
            label.textContent = item.label + ': ';
            div.appendChild(label);
            
            const value = document.createElement('span');
            value.className = 'result-value';
            value.textContent = item.value;
            div.appendChild(value);
            
            resultsContainer.appendChild(div);
        });
        
        // Detalle de costos
        if (results.salary > 0) {
            const costDetail = document.createElement('div');
            costDetail.className = 'result-item';
            
            const label = document.createElement('span');
            label.textContent = 'Detalle de costos: ';
            costDetail.appendChild(label);
            
            const value = document.createElement('div');
            value.className = 'result-value';
            value.appendChild(generateCostDetail(results.effort, results.duration, results.salary));
            costDetail.appendChild(value);
            
            resultsContainer.appendChild(costDetail);
        }
        
        document.getElementById('results').style.display = 'block';
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    }

    // Función principal de cálculo
    document.getElementById('calculate-btn').addEventListener('click', function() {
        // Validar tamaño del proyecto
        const klocInput = document.getElementById('kloc');
        const kloc = parseFloat(klocInput.value);
        
        if (isNaN(kloc) || kloc <= 0) {
            alert('Por favor ingrese un tamaño válido para el proyecto (KLOC mayor que 0)');
            klocInput.focus();
            return;
        }

        // Obtener parámetros
        const projectType = document.getElementById('project-type').value;
        const constants = cocomoConstants[projectType];
        const eaf = calculateEAF();
        const mode = document.getElementById('calculation-mode').value;
        const salaryInput = document.getElementById('salary');
        const salary = parseFloat(salaryInput.value) || 0;

        // Calcular esfuerzo básico
        const effort = constants.a * Math.pow(kloc, constants.b) * eaf;
        let duration, teamSize;

        // Calcular según el modo seleccionado
        switch(mode) {
            case 'team':
                const teamSizeInput = document.getElementById('team-size');
                teamSize = parseFloat(teamSizeInput.value);
                
                if (isNaN(teamSize) || teamSize <= 0) {
                    alert('Por favor ingrese un número válido de programadores');
                    teamSizeInput.focus();
                    return;
                }
                
                duration = effort / teamSize;
                break;
                
            case 'duration':
                const durationInput = document.getElementById('desired-duration');
                duration = parseFloat(durationInput.value);
                
                if (isNaN(duration) || duration <= 0) {
                    alert('Por favor ingrese una duración válida en meses');
                    durationInput.focus();
                    return;
                }
                
                teamSize = effort / duration;
                break;
                
            default: // 'effort'
                duration = constants.c * Math.pow(effort, constants.d);
                teamSize = effort / duration;
        }

        // Calcular costo
        const totalCost = calculateTotalCost(effort, duration, salary);

        // Mostrar resultados
        displayResults({
            projectType: projectType === 'organic' ? 'Orgánico' : 
                        projectType === 'semi-detached' ? 'Semi-acoplado' : 'Empotrado',
            kloc: kloc,
            eaf: eaf,
            effort: effort,
            duration: duration,
            teamSize: teamSize,
            salary: salary,
            totalCost: totalCost
        });
    });

    // Inicializar la primera pestaña como activa
    document.querySelector('.tab').click();
});