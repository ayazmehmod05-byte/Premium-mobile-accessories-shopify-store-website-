/* ===================================================================
   3D Particle Constellation Background — Royal Sphire
   Interactive, canvas-based gold particle network that reacts to mouse.
   Highly optimized for performance.
   =================================================================== */

(function () {
  'use strict';

  function prefersReducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (_) {
      return false;
    }
  }

  function init3DRoom() {
    var scene = document.getElementById('scene-3d');
    if (!scene) return;

    // Create Canvas
    var canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    scene.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    var particles = [];
    var maxParticles = 75;
    var connectionDist = 125;
    
    var mouse = { x: null, y: null, radius: 150 };

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse
    document.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    document.addEventListener('mouseleave', function () {
      mouse.x = null;
      mouse.y = null;
    });

    // Particle class
    function Particle() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2.5 + 1.5;
    }

    Particle.prototype.update = function () {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off walls
      if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
      if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

      // Gentle mouse interaction (pull particles slightly)
      if (mouse.x !== null && mouse.y !== null) {
        var dx = mouse.x - this.x;
        var dy = mouse.y - this.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          var force = (mouse.radius - dist) / mouse.radius;
          this.x -= dx * force * 0.03;
          this.y -= dy * force * 0.03;
        }
      }
    };

    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(229, 169, 59, 0.55)'; // Gold particles
      ctx.fill();
    };

    // Initialize particles
    for (var i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    var rafId = null;

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (var a = 0; a < particles.length; a++) {
        var pA = particles[a];
        pA.update();
        pA.draw();

        for (var b = a + 1; b < particles.length; b++) {
          var pB = particles[b];
          var dx = pA.x - pB.x;
          var dy = pA.y - pB.y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            var alpha = (1 - dist / connectionDist) * 0.18;
            ctx.beginPath();
            ctx.moveTo(pA.x, pA.y);
            ctx.lineTo(pB.x, pB.y);
            ctx.strokeStyle = 'rgba(229, 169, 59, ' + alpha + ')'; // Gold connecting lines
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw connections to mouse
        if (mouse.x !== null && mouse.y !== null) {
          var dxMouse = pA.x - mouse.x;
          var dyMouse = pA.y - mouse.y;
          var distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
          if (distMouse < mouse.radius) {
            var alphaMouse = (1 - distMouse / mouse.radius) * 0.25;
            ctx.beginPath();
            ctx.moveTo(pA.x, pA.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = 'rgba(22, 160, 133, ' + alphaMouse + ')'; // Mint connection to mouse!
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      rafId = requestAnimationFrame(animate);
    }

    animate();

    // Pause animation when tab hidden
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      } else {
        if (!rafId) animate();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (prefersReducedMotion()) return;
    try {
      init3DRoom();
    } catch (err) {
      if (typeof console !== 'undefined') {
        console.warn('[3D-Room] Init error:', err);
      }
    }
  });
})();
