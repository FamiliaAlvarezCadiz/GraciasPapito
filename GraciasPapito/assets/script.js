/*
 * ========================================
 * CARTA DE GRATITUD MÉDICA - LÓGICA INTERACTIVA
 * ========================================
 * 
 * Este archivo maneja:
 * 1. La navegación SPA (Single Page Application) con transiciones de 0.8s
 * 2. Las transiciones suaves entre secciones (fade in/out)
 * 3. La funcionalidad del modal "Diagnóstico de Gratitud"
 * 4. La animación de la red neuronal de fondo
 * 5. La animación de la línea de EKG
 */

// ========================================
// SEGURIDAD INICIAL
// ========================================
const PASSWORD_REQUERIDA = "coti123"; // CAMBIA ESTA LÍNEA PARA CAMBIAR LA CONTRASEÑA

// ========================================
// CONFIGURACIÓN Y SELECCIÓN DE ELEMENTOS
// ========================================

// Seleccionar todos los botones de navegación
const navLinks = document.querySelectorAll('.nav-link');

// Seleccionar todas las secciones de contenido
const contentSections = document.querySelectorAll('.content-section');

// Seleccionar el botón de diagnóstico
const diagnosticoBtn = document.getElementById('diagnosticoBtn');

// Seleccionar el modal y sus elementos
const modal = document.getElementById('modalDiagnostico');
const modalClose = document.querySelector('.modal-close');

// ========================================
// FUNCIONES PRINCIPALES
// ========================================

/**
 * Función para cambiar de sección en la SPA
 * Utiliza transiciones suaves de 0.8 segundos
 * 
 * @param {string} sectionId - El ID de la sección a mostrar
 */
function changeSection(sectionId) {
    // Encontrar la sección actual activa
    const currentSection = document.querySelector('.content-section.active');
    
    // Si existe una sección activa, aplicar la animación de salida
    // La sección se desvanece en 0.8 segundos
    if (currentSection) {
        currentSection.classList.remove('active');
    }
    
    // Encontrar la nueva sección a mostrar
    const newSection = document.getElementById(sectionId);
    
    // Aplicar la clase 'active' para la animación de entrada
    // La nueva sección aparece suavemente en 0.8 segundos
    if (newSection) {
        newSection.classList.add('active');
    }
    
    // Actualizar los botones de navegación para mostrar cuál está activo
    updateActiveNavLink(sectionId);
    
    // Desplazar suavemente la página hacia el inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Función para actualizar el estado activo de los botones de navegación
 * Resalta el botón correspondiente a la sección actual
 * 
 * @param {string} activeSection - El ID de la sección activa
 */
function updateActiveNavLink(activeSection) {
    // Remover la clase 'active' de todos los botones
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Agregar la clase 'active' al botón correspondiente
    const activeLink = document.querySelector(`[data-section="${activeSection}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

/**
 * Función para mostrar el modal del diagnóstico de gratitud
 * Incluye efecto de blur en el fondo
 */
function showModal() {
    modal.classList.add('show');
    // Resetear el scroll del contenido del modal al inicio para asegurar que se vea desde el título
    modal.querySelector('.modal-content').scrollTop = 0;
    // Prevenir el scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
}

/**
 * Función para cerrar el modal del diagnóstico de gratitud
 */
function closeModal() {
    modal.classList.remove('show');
    // Permitir el scroll del body nuevamente
    document.body.style.overflow = 'auto';
}

// ========================================
// ANIMACIÓN DE RED NEURONAL EN CANVAS
// ========================================

/**
 * Función para inicializar y animar la red neuronal de fondo
 * Crea nodos conectados con líneas que se mueven lentamente
 */
function initializeNeuralNetwork() {
    const canvas = document.getElementById('neuralCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Establecer el tamaño del canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Configuración de nodos de la red neuronal
    const nodeCount = 30;
    const nodes = [];
    let time = 0;
    
    // Crear nodos iniciales
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            radius: Math.random() * 2 + 1
        });
    }
    
    /**
     * Función de animación principal
     */
    function animate() {
        // Limpiar el canvas con fondo semitransparente
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Actualizar posición de cada nodo
        nodes.forEach(node => {
            // Movimiento ondulante basado en el tiempo
            node.x += node.vx * 0.5;
            node.y += node.vy * 0.5;
            
            // Rebotar en los límites del canvas
            if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
            
            // Asegurar que los nodos permanezcan dentro de los límites
            node.x = Math.max(0, Math.min(canvas.width, node.x));
            node.y = Math.max(0, Math.min(canvas.height, node.y));
        });
        
        // Dibujar las conexiones (líneas) entre nodos cercanos
        const connectionDistance = 150;
        
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    // Dibujar línea con gradiente (ambar/naranja)
                    const opacity = (1 - distance / connectionDistance) * 0.9;
                    // Y cámbialo a azul eléctrico:
                    ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`; // Azul eléctrico
                    ctx.fillStyle = "#00F0FF";
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }
        
        // Dibujar los nodos (puntos)
        nodes.forEach(node => {
            ctx.fillStyle = 'rgba(197, 179, 88, 0.6)';
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fill();
        });
        
        time++;
        requestAnimationFrame(animate);
    }
    
    animate();
}

/**
 * Configura la lógica de validación de contraseña
 */
function initSecurity() {
    const passInput = document.getElementById('passInput');
    const passBtn = document.getElementById('passBtn');
    const barrier = document.getElementById('passwordBarrier');
    const errorMsg = document.getElementById('passError');

    if (!passInput || !passBtn) return;

    // Enfocar automáticamente el input para facilitar la entrada
    passInput.focus();

    function validate() {
        if (passInput.value === PASSWORD_REQUERIDA) {
            barrier.style.opacity = '0';
            setTimeout(() => {
                barrier.style.display = 'none';
                // Permitir el scroll una vez desbloqueado
                document.body.style.overflow = 'auto';
            }, 500);
        } else {
            errorMsg.style.display = 'block';
            passInput.value = '';
            passInput.focus();
        }
    }

    passBtn.addEventListener('click', validate);
    passInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') validate();
    });
}

// ========================================
// EVENT LISTENERS - NAVEGACIÓN
// ========================================

// Agregar listeners a cada botón de navegación
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        // Obtener el ID de la sección desde el atributo data-section
        const sectionId = this.getAttribute('data-section');
        // Cambiar a la nueva sección
        changeSection(sectionId);
    });
});

// ========================================
// EVENT LISTENERS - MODAL DE DIAGNÓSTICO
// ========================================

// Listener para el botón de diagnóstico
if (diagnosticoBtn) {
    diagnosticoBtn.addEventListener('click', showModal);
}

// Listener para cerrar el modal (botón X)
if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

// Listener para cerrar el modal al hacer clic fuera del contenido
if (modal) {
    modal.addEventListener('click', function(event) {
        // Verificar que el clic fue en el fondo del modal, no en el contenido
        if (event.target === modal) {
            closeModal();
        }
    });
}

// Listener para cerrar el modal presionando la tecla ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// ========================================
// INICIALIZACIÓN
// ========================================

/**
 * Función de inicialización que se ejecuta cuando la página carga
 * Realiza todas las configuraciones iniciales necesarias
 */
function initialize() {
    // Bloquear el scroll inicialmente mientras la pantalla de seguridad está activa
    document.body.style.overflow = 'hidden';
    
    // Inicializar lógica de seguridad
    initSecurity();

    // Establecer la sección de inicio como activa
    changeSection('inicio');
    
    // Inicializar la red neuronal animada
    initializeNeuralNetwork();
    
    // Mensaje de bienvenida en la consola
    console.log('❤️ ¡Bienvenido a Gracias Papito! La página médica de gratitud ha sido cargada correctamente.');
}

// Ejecutar la inicialización cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', initialize);

// ========================================
// COMENTARIOS FINALES
// ========================================
/*
 * CARACTERÍSTICAS DE ESTA PÁGINA:
 * 
 * 1. NAVEGACIÓN SPA FLUIDA:
 *    - Las secciones cambian sin recargar la página
 *    - Transiciones suaves de 0.8 segundos (fade in/out)
 *    - Scroll automático al cambiar de sección
 * 
 * 2. DISEÑO MÉDICO + TECNOLÓGICO:
 *    - Línea de EKG animada en la parte superior
 *    - Red neuronal dinámica en el fondo (canvas)
 *    - Marcas de agua de circuitos integrados
 *    - Paleta de colores: Oro antiguo, Azul marino, Burgundy
 * 
 * 3. INTERACTIVIDAD:
 *    - Modal elegante del diagnóstico de gratitud
 *    - Múltiples formas de cerrar el modal (X, ESC, clic afuera)
 *    - Animaciones suaves en iconos (pulso, rotación, zoom)
 * 
 * 4. RESPONSIVIDAD:
 *    - Diseño totalmente adaptable a móvil, tablet y desktop
 *    - Canvas se redimensiona automáticamente
 *    - Navegación optimizada para pantallas pequeñas
 * 
 * 5. TODO EN ESPAÑOL:
 *    - Contenido, comentarios y mensajes completamente en español
 *    - Diseño profesional para un padre médico
 *    - Mezcla perfecta de ciencia y emoción
 */
