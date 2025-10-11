
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
      if(window.scrollY > 10) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    });

    // Hamburger menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('primary-navigation');

    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
      menuToggle.setAttribute('aria-expanded', !expanded);
      menuToggle.classList.toggle('active');
      nav.classList.toggle('open');
    });

    // Close menu on navigation link click (mobile)
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if(nav.classList.contains('open')){
          nav.classList.remove('open');
          menuToggle.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', false);
        }
      });
    });

    // Close menu on ESC key when open
    window.addEventListener('keydown', (e) => {
      if(e.key === 'Escape' && nav.classList.contains('open')){
        nav.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', false);
        menuToggle.focus();
      }
    });

    const canvas = document.getElementById('bg');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 35;

    const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Glowing cube edges
    const geometry = new THREE.BoxGeometry(14, 14, 14);
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({color: 0xff4560, linewidth: 2});
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    wireframe.material.transparent = true;
    wireframe.material.opacity = 0.8;

    const cube = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
      color: 0x22000a,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide
    }));

    scene.add(cube);
    scene.add(wireframe);

    // Starfield
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 600;
    const starPositions = new Float32Array(starCount * 3);

    for(let i=0; i<starCount*3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 300;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

    const starMaterial = new THREE.PointsMaterial({color: 0xffffff, size: 0.4, sizeAttenuation: true});
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    let mouse = {x:0, y:0};
    let targetMouse = {x:0, y:0};

    window.addEventListener('mousemove', (e) => {
      targetMouse.x = (e.clientX / window.innerWidth) * 2 -1;
      targetMouse.y = -(e.clientY / window.innerHeight) * 2 +1;
    });
    window.addEventListener('touchmove', (e) => {
      if(e.touches.length > 0){
        targetMouse.x = (e.touches[0].clientX / window.innerWidth) * 2 -1;
        targetMouse.y = -(e.touches[0].clientY / window.innerHeight) * 2 +1;
      }
    }, {passive:true});

    function lerp(start, end, amt){
      return (1 - amt) * start + amt * end;
    }

    function animate(){
      requestAnimationFrame(animate);

      mouse.x = lerp(mouse.x, targetMouse.x, 0.05);
      mouse.y = lerp(mouse.y, targetMouse.y, 0.05);

      stars.rotation.x = mouse.y * 0.3;
      stars.rotation.y = mouse.x * 0.6;

      cube.rotation.x += 0.002 + mouse.y * 0.001;
      cube.rotation.y += 0.003 + mouse.x * 0.002;

      wireframe.rotation.x = cube.rotation.x;
      wireframe.rotation.y = cube.rotation.y;

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });