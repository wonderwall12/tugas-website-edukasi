/**
 * ==========================================================================
 * EDUCODE - SYSTEM JAVASCRIPT UTAMA (DILENGKAPI KOMENTAR EDUPAK)
 * Platform Edukasi Web Development (HTML, CSS, JS, Bootstrap, Tailwind)
 * ==========================================================================
 * Berkas ini mengatur seluruh logika interaktif pada website, meliputi:
 * 1. Pengubah Tema Gelap & Terang (Dark / Light Mode) dengan memori localStorage
 * 2. Navigasi Responsif & Penanda Halaman Aktif (Active Navigation Highlight)
 * 3. Fitur Tombol Salin Kode Snippet ke Clipboard
 * 4. Engine Live Code Sandbox Playground (HTML/CSS/JS Live Runner)
 * 5. Engine Kuis Interaktif 10 Pertanyaan & Sertifikat Kelulusan Digital
 * 6. Demo Aplikasi Interaktif Mini (Counter, Stylist Box, Mini Todo List)
 * ==========================================================================
 */

// Menjalankan inisialisasi fungsi setelah seluruh struktur HTML (DOM) selesai dimuat di browser
document.addEventListener('DOMContentLoaded', () => {
  initTheme();              // 1. Inisialisasi pengatur tema (Dark/Light Mode)
  initNavigation();         // 2. Inisialisasi navigasi aktif & drawer mobile
  initCopyCodeButtons();    // 3. Inisialisasi tombol salin kode
  initPlayground();         // 4. Inisialisasi live code editor playground
  initQuiz();               // 5. Inisialisasi engine kuis interaktif
  initJsDemos();            // 6. Inisialisasi demo aplikasi JS mini
});

/* ==========================================================================
   1. PENGELOLA TEMA GELAP / TERANG (DARK & LIGHT MODE ENGINE)
   Fungsi: Membaca status tema dari memori browser (localStorage) dan 
   mengubah atribut data-theme pada elemen <html> secara langsung.
   ========================================================================== */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  // Membaca tema yang tersimpan sebelumnya, atau gunakan 'light' sebagai bawaan
  const savedTheme = localStorage.getItem('educode_theme') || 'light';
  
  // Terapkan tema pada elemen <html>
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);

  // Menambahkan Event Listener pada setiap tombol pengubah tema
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      // Beralih antara mode 'dark' dan 'light'
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      // Simpan perubahan ke HTML & localStorage
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('educode_theme', newTheme);
      updateThemeIcons(newTheme);
    });
  });
}

/**
 * Fungsi Pembantu: Memperbarui Ikon Tombol Tema (Matahari / Bulan)
 * @param {string} theme - 'dark' atau 'light'
 */
function updateThemeIcons(theme) {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    const icon = btn.querySelector('i');
    if (icon) {
      if (theme === 'dark') {
        icon.className = 'fas fa-sun'; // Tampilkan ikon matahari saat mode gelap aktif
        btn.setAttribute('title', 'Beralih ke Mode Terang');
      } else {
        icon.className = 'fas fa-moon'; // Tampilkan ikon bulan saat mode terang aktif
        btn.setAttribute('title', 'Beralih ke Mode Gelap');
      }
    }
  });
}

/* ==========================================================================
   2. NAVIGASI RESPONSIF & PENANDA HALAMAN AKTIF
   Fungsi: Menandai tautan navigasi yang sedang dibuka pengguna dan 
   mengatur pembukaan/penutupan drawer navigasi layar HP/Mobile.
   ========================================================================== */
function initNavigation() {
  // Mendapatkan nama berkas halaman HTML yang sedang dibuka (contoh: 'html-dasar.html')
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .sidebar-link');
  
  // Mencocokkan atribut href dengan halaman yang sedang aktif
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active'); // Tambahkan class .active untuk styling sorotan
    }
  });

  // Pengendali Drawer Navigasi Mobile (Layar Sentuh)
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const drawerCloseBtn = document.querySelector('.drawer-close-btn');

  if (mobileBtn && drawer && overlay) {
    const openMenu = () => {
      drawer.classList.add('open');
      overlay.classList.add('open');
    };
    const closeMenu = () => {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
    };

    mobileBtn.addEventListener('click', openMenu);
    overlay.addEventListener('click', closeMenu);
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeMenu);
  }
}

/* ==========================================================================
   3. FITUR TOMBOL SALIN KODE SNIPPET (COPY TO CLIPBOARD)
   Fungsi: Menyalin teks kode di dalam elemen <code> ke dalam clipboard 
   komputer/HP pengguna dengan umpan balik visual animasi instan.
   ========================================================================== */
function initCopyCodeButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Mencari elemen <code> terdekat dari tombol salin yang diklik
      const codeBox = btn.closest('.code-box');
      const codeContent = codeBox ? codeBox.querySelector('code') : null;

      if (codeContent) {
        // Menggunakan API navigator.clipboard bawaan browser
        navigator.clipboard.writeText(codeContent.innerText.trim()).then(() => {
          const originalText = btn.innerHTML;
          // Ubah tampilan tombol sementara sebagai umpan balik
          btn.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
          btn.style.background = '#10b981';
          btn.style.color = '#fff';

          // Kembalikan tampilan tombol setelah 2 detik
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.color = '';
          }, 2000);
        }).catch(err => {
          console.error('Gagal menyalin kode:', err);
        });
      }
    });
  });
}

/* ==========================================================================
   4. ENGINE LIVE CODE EDITOR PLAYGROUND (LIVE HTML/CSS/JS SANDBOX)
   Fungsi: Merender secara live gabungan input HTML, CSS, dan JS pengguna
   ke dalam elemen <iframe> secara real-time saat terjadi pengetikan.
   ========================================================================== */
function initPlayground() {
  const htmlInput = document.getElementById('playground-html');
  const cssInput = document.getElementById('playground-css');
  const jsInput = document.getElementById('playground-js');
  const previewFrame = document.getElementById('playground-preview');
  const runBtn = document.getElementById('playground-run-btn');
  const templateSelect = document.getElementById('playground-template');

  if (!previewFrame || !htmlInput) return; // Hentikan jika tidak di halaman playground

  /**
   * Fungsi Eksekusi Render: Menggabungkan kode HTML, CSS, dan JS
   * ke dalam dokumen <iframe> terpisah agar aman dari efek samping global.
   */
  function updatePreview() {
    const html = htmlInput ? htmlInput.value : '';
    const css = cssInput ? cssInput.value : '';
    const js = jsInput ? jsInput.value : '';

    // Gabungkan pustaka CDN Bootstrap 5 & Tailwind CSS di dalam <iframe> preview
    const combinedSource = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!-- Dukungan CDN Bootstrap 5 & Tailwind CSS untuk Preview Live -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body { font-family: sans-serif; padding: 15px; background-color: #ffffff; color: #1e293b; }
          ${css}
        </style>
      </head>
      <body>
        ${html}
        <script>
          try {
            ${js}
          } catch (err) {
            console.error("Playground JS Error:", err);
          }
        </script>
      </body>
      </html>
    `;

    // Tulis dokumen ke dalam <iframe>
    const iframeDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(combinedSource);
    iframeDoc.close();
  }

  // Tombol 'Jalankan Kode' Manual
  if (runBtn) runBtn.addEventListener('click', updatePreview);

  // Penjelasan Debounce: Memperbarui preview 500ms setelah pengguna berhenti mengetik
  let debounceTimeout;
  [htmlInput, cssInput, jsInput].forEach(textarea => {
    if (textarea) {
      textarea.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(updatePreview, 500);
      });
    }
  });

  // Pilihan Template Kode Siap Pakai
  if (templateSelect) {
    const templates = {
      default: {
        html: `<div class="card">\n  <h2>Halo Dunia HTML!</h2>\n  <p>Ini adalah hasil render live di browser.</p>\n  <button id="demoBtn">Klik Saya!</button>\n</div>`,
        css: `.card {\n  background: linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%);\n  padding: 20px;\n  border-radius: 12px;\n  border: 1px solid #c7d2fe;\n}\nh2 { color: #4338ca; }\nbutton {\n  background: #4f46e5;\n  color: white;\n  border: none;\n  padding: 8px 16px;\n  border-radius: 6px;\n  cursor: pointer;\n}`,
        js: `document.getElementById('demoBtn').addEventListener('click', () => {\n  alert('Selamat! JavaScript Anda berhasil berjalan!');\n});`
      },
      bootstrap: {
        html: `<div class="container py-3">\n  <div class="card shadow-sm">\n    <div class="card-body">\n      <h5 class="card-title text-primary"><i class="bi bi-star"></i> Kartu Bootstrap 5</h5>\n      <p class="card-text">Dibuat menggunakan utility class bawaan Bootstrap 5.</p>\n      <a href="#" class="btn btn-primary">Tombol Bootstrap</a>\n    </div>\n  </div>\n</div>`,
        css: `/* Anda bisa menambahkan custom CSS tambahan di sini */`,
        js: `// JavaScript khusus jika diperlukan`
      },
      tailwind: {
        html: `<div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 border border-gray-100">\n  <h3 class="text-xl font-bold text-indigo-600">Tailwind CSS Component</h3>\n  <p class="mt-2 text-gray-600">Menggunakan utility-first classes seperti max-w-md, bg-white, shadow-md.</p>\n  <button class="mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:opacity-90">Hover Me</button>\n</div>`,
        css: `/* Tailwind di-load via Play CDN secara otomatis */`,
        js: ``
      },
      form: {
        html: `<form id="contactForm" class="space-y-4">\n  <h3>Formulir Pendaftaran</h3>\n  <div>\n    <label>Nama Lengkap:</label><br>\n    <input type="text" id="nama" required style="width:100%; padding:8px; margin-top:4px;">\n  </div>\n  <div>\n    <label>Email:</label><br>\n    <input type="email" id="email" required style="width:100%; padding:8px; margin-top:4px;">\n  </div>\n  <button type="submit" style="background:#10b981; color:white; padding:8px 16px; border:none; border-radius:4px;">Kirim Data</button>\n</form>\n<div id="formResult" style="margin-top:15px; font-weight:bold; color:#059669;"></div>`,
        css: `form { max-width: 400px; padding: 15px; border: 1px solid #ccc; border-radius: 8px; }`,
        js: `document.getElementById('contactForm').addEventListener('submit', (e) => {\n  e.preventDefault();\n  const nama = document.getElementById('nama').value;\n  document.getElementById('formResult').innerText = 'Terima kasih, ' + nama + '! Form berhasil dikirim.';\n});`
      }
    };

    templateSelect.addEventListener('change', (e) => {
      const selected = templates[e.target.value] || templates.default;
      if (htmlInput) htmlInput.value = selected.html;
      if (cssInput) cssInput.value = selected.css;
      if (jsInput) jsInput.value = selected.js;
      updatePreview();
    });
  }

  // Jalankan render awal
  updatePreview();
}

/* ==========================================================================
   5. ENGINE KUIS INTERAKTIF & GENERATOR SERTIFIKAT DIGITAL
   Fungsi: Mengelola daftar pertanyaan kuis, memeriksa jawaban pengguna,
   menampilkan penjelasan materi instan, serta kalkulasi nilai kelulusan.
   ========================================================================== */
function initQuiz() {
  const quizContainer = document.getElementById('quiz-container');
  if (!quizContainer) return; // Hentikan jika tidak berada di halaman kuis

  // Array Pertanyaan Kuis Edukasi
  const quizQuestions = [
    {
      question: "Tag HTML manakah yang digunakan untuk membuat judul utama atau paling penting pada halaman?",
      options: ["<heading>", "<h6>", "<h1>", "<head>"],
      correct: 2,
      explanation: "Tag <h1> digunakan untuk judul utama terbesar dan paling penting dalam hirarki heading HTML (<h1> hingga <h6>)."
    },
    {
      question: "Atribut apakah pada tag <img> yang wajib ada untuk memberikan deskripsi teks alternatif jika gambar gagal dimuat?",
      options: ["src", "alt", "title", "description"],
      correct: 1,
      explanation: "Atribut 'alt' (alternative text) digunakan untuk memberikan penjelasan teks tentang gambar bagi pembaca layar (screen reader) dan SEO."
    },
    {
      question: "Tag HTML manakah yang digunakan untuk membuat daftar berurutan (numbered list)?",
      options: ["<ul>", "<dl>", "<list>", "<ol>"],
      correct: 3,
      explanation: "Tag <ol> (Ordered List) menghasilkan daftar berurutan dengan angka atau huruf, sedangkan <ul> (Unordered List) menghasilkan bullet points."
    },
    {
      question: "Atribut HTML manakah yang digunakan untuk membuka tautan <a> di tab browser baru?",
      options: ["target=\"_blank\"", "target=\"_new\"", "open=\"newtab\"", "href=\"blank\""],
      correct: 0,
      explanation: "Atribut target=\"_blank\" memerintahkan peramban untuk membuka dokumen yang dituju pada jendela atau tab baru."
    },
    {
      question: "Properti CSS apakah yang digunakan untuk mengubah warna latar belakang sebuah elemen?",
      options: ["color", "bg-color", "background-color", "surface-color"],
      correct: 2,
      explanation: "Properti 'background-color' menentukan warna latar belakang dari elemen HTML."
    },
    {
      question: "Dalam CSS Box Model, urutan dari area paling dalam ke paling luar adalah?",
      options: ["Content -> Padding -> Border -> Margin", "Content -> Margin -> Border -> Padding", "Margin -> Border -> Padding -> Content", "Padding -> Content -> Border -> Margin"],
      correct: 0,
      explanation: "Box Model terdiri dari Content (isi), Padding (ruang dalam), Border (garis tepi), dan Margin (ruang luar)."
    },
    {
      question: "Apa filosofi utama dari kerangka kerja Tailwind CSS dibanding Bootstrap?",
      options: ["Component-first", "Utility-first", "No-class CSS", "Inline styling only"],
      correct: 1,
      explanation: "Tailwind CSS mengusung filosofi Utility-first, yaitu menyediakan kelas-kelas utilitas kecil tunggal untuk merakit desain secara fleksibel."
    },
    {
      question: "Metode JavaScript manakah yang digunakan untuk memilih elemen HTML berdasarkan ID-nya?",
      options: ["document.getElementByName()", "document.querySelector('#id')", "document.getElementById()", "Jawaban B dan C benar"],
      correct: 3,
      explanation: "Baik document.getElementById('namaId') maupun document.querySelector('#namaId') dapat digunakan untuk memilih elemen berdasarkan ID."
    },
    {
      question: "Event listener apakah yang digunakan di JavaScript saat pengguna mengklik sebuah tombol?",
      options: ["onhover", "click", "submit", "change"],
      correct: 1,
      explanation: "Event 'click' dipicu ketika pengguna menekan dan melepaskan tombol pada elemen."
    },
    {
      question: "Tag HTML5 manakah yang digunakan untuk memutar video langsung tanpa menggunakan plugin eksternal?",
      options: ["<media>", "<video>", "<movie>", "<embed>"],
      correct: 1,
      explanation: "Tag <video> disediakan di HTML5 untuk menyematkan berkas video dengan kontrol bawaan peramban."
    }
  ];

  let currentQuestionIndex = 0;
  let score = 0;
  let userAnswers = Array(quizQuestions.length).fill(null);

  /**
   * Render Pertanyaan Kuis Aktif ke dalam DOM
   */
  function renderQuestion() {
    const q = quizQuestions[currentQuestionIndex];
    const total = quizQuestions.length;

    quizContainer.innerHTML = `
      <div class="quiz-card">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span style="font-weight:700; color:var(--accent-primary);">Pertanyaan ${currentQuestionIndex + 1} dari ${total}</span>
          <span style="font-size:0.9rem; color:var(--text-muted);">Skor Saat Ini: ${score * 10}</span>
        </div>
        <div class="quiz-progress">
          <div class="quiz-progress-bar" style="width: ${((currentQuestionIndex + 1) / total) * 100}%;"></div>
        </div>

        <h3 style="font-size:1.25rem; font-weight:700; margin: 1.5rem 0 1rem 0;">${q.question}</h3>

        <div class="quiz-options">
          ${q.options.map((opt, idx) => `
            <button class="quiz-option-btn ${userAnswers[currentQuestionIndex] === idx ? 'selected' : ''}" data-index="${idx}">
              <span style="width:28px; height:28px; border-radius:50%; background:var(--border-color); display:inline-flex; align-items:center; justify-content:center; font-size:0.85rem; font-weight:700;">${String.fromCharCode(65 + idx)}</span>
              <span>${escapeHtml(opt)}</span>
            </button>
          `).join('')}
        </div>

        <div id="quiz-explanation" style="display:none;" class="info-callout tip mt-3">
          <i class="fas fa-lightbulb"></i>
          <div>
            <strong>Penjelasan Materi:</strong>
            <p id="explanation-text" class="mb-0 mt-1"></p>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; margin-top:2rem;">
          <button id="prev-q-btn" class="btn btn-secondary" ${currentQuestionIndex === 0 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
            <i class="fas fa-arrow-left"></i> Sebelumnya
          </button>
          <button id="next-q-btn" class="btn btn-primary">
            ${currentQuestionIndex === total - 1 ? 'Lihat Hasil Akhir <i class="fas fa-trophy"></i>' : 'Berikutnya <i class="fas fa-arrow-right"></i>'}
          </button>
        </div>
      </div>
    `;

    // Event Listener Pemilihan Opsi Jawaban
    const optionBtns = quizContainer.querySelectorAll('.quiz-option-btn');
    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedIdx = parseInt(btn.getAttribute('data-index'));
        userAnswers[currentQuestionIndex] = selectedIdx;

        // Visualisasi warna pilihan jawaban (Hijau jika benar, Merah jika salah)
        optionBtns.forEach(b => b.classList.remove('selected', 'correct', 'incorrect'));
        btn.classList.add('selected');

        const expBox = document.getElementById('quiz-explanation');
        const expText = document.getElementById('explanation-text');
        
        if (selectedIdx === q.correct) {
          btn.classList.add('correct');
        } else {
          btn.classList.add('incorrect');
          optionBtns[q.correct].classList.add('correct'); // Sorot jawaban yang benar
        }

        if (expBox && expText) {
          expText.innerText = q.explanation;
          expBox.style.display = 'flex';
        }
      });
    });

    // Navigasi Pertanyaan (Sebelumnya & Berikutnya)
    const prevBtn = document.getElementById('prev-q-btn');
    const nextBtn = document.getElementById('next-q-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
          currentQuestionIndex--;
          renderQuestion();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (userAnswers[currentQuestionIndex] === null) {
          alert('Silakan pilih salah satu jawaban terlebih dahulu!');
          return;
        }

        if (currentQuestionIndex < total - 1) {
          currentQuestionIndex++;
          renderQuestion();
        } else {
          calculateResults(); // Hitung hasil kuis jika berada di pertanyaan terakhir
        }
      });
    }
  }

  /**
   * Kalkulasi Hasil Akhir Kuis & Render Sertifikat Digital
   */
  function calculateResults() {
    score = 0;
    quizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) {
        score++;
      }
    });

    const percentage = Math.round((score / quizQuestions.length) * 100);

    quizContainer.innerHTML = `
      <div class="quiz-card text-center">
        <div style="font-size:3.5rem; color:var(--accent-primary); margin-bottom:1rem;">
          <i class="fas ${percentage >= 70 ? 'fa-award' : 'fa-graduation-cap'}"></i>
        </div>
        <h2 style="font-size:2rem; font-weight:800;">Kuis Selesai!</h2>
        <p style="color:var(--text-secondary); font-size:1.1rem;" class="mt-2">
          Anda berhasil menjawab <strong>${score}</strong> dari <strong>${quizQuestions.length}</strong> pertanyaan dengan benar.
        </p>

        <div style="font-size:2.5rem; font-weight:800; color:var(--accent-primary); margin:1.5rem 0;">
          Nilai Akhir: ${percentage}%
        </div>

        ${percentage >= 70 ? `
          <!-- Tampilan Sertifikat Digital untuk Skor >= 70% -->
          <div class="certificate-box">
            <h2>SERTIFIKAT KELULUSAN</h2>
            <p>Diberikan Kepada:</p>
            <div class="certificate-name" id="cert-user-name">Pengembang Web Pembelajar</div>
            <p style="margin-top:1rem;">Atas keberhasilan menguasai materi dasar HTML, CSS, & JavaScript</p>
            <div style="margin-top:1.5rem; font-size:0.85rem; color:#cbd5e1;">EduCode Learning Platform - 2026</div>
          </div>
        ` : `
          <div class="info-callout important mt-3">
            <i class="fas fa-exclamation-triangle"></i>
            <div>
              <strong>Tetap Semangat!</strong> Nilai minimal kelulusan sertifikat adalah 70%. Anda dapat mempelajari kembali materi dan mengulang kuis kapan saja.
            </div>
          </div>
        `}

        <div style="display:flex; justify-content:center; gap:1rem; margin-top:2rem;">
          <button id="restart-quiz-btn" class="btn btn-secondary">
            <i class="fas fa-redo"></i> Ulangi Kuis
          </button>
          <a href="playground.html" class="btn btn-primary">
            <i class="fas fa-code"></i> Coba Playground
          </a>
        </div>
      </div>
    `;

    document.getElementById('restart-quiz-btn').addEventListener('click', () => {
      currentQuestionIndex = 0;
      score = 0;
      userAnswers = Array(quizQuestions.length).fill(null);
      renderQuestion();
    });
  }

  // Tampilkan pertanyaan pertama
  renderQuestion();
}

/* ==========================================================================
   6. DEMO APLIKASI INTERAKTIF MINI (JAVASCRIPT DASAR PAGE)
   Fungsi: Mengatur logika 3 demo aplikasi mini pada halaman javascript-dasar.html.
   ========================================================================== */
function initJsDemos() {
  // 1. Aplikasi Hitung (Counter App)
  const counterVal = document.getElementById('demo-counter-val');
  const incBtn = document.getElementById('demo-inc-btn');
  const decBtn = document.getElementById('demo-dec-btn');
  const resetBtn = document.getElementById('demo-reset-btn');

  if (counterVal && incBtn) {
    let count = 0;
    incBtn.addEventListener('click', () => { count++; counterVal.innerText = count; });
    decBtn.addEventListener('click', () => { count--; counterVal.innerText = count; });
    resetBtn.addEventListener('click', () => { count = 0; counterVal.innerText = count; });
  }

  // 2. Pengubah Gaya Box Real-time (Dynamic Styling)
  const boxTarget = document.getElementById('demo-box-target');
  const colorPicker = document.getElementById('demo-color-picker');
  const textInput = document.getElementById('demo-text-input');

  if (boxTarget && colorPicker && textInput) {
    colorPicker.addEventListener('input', (e) => {
      boxTarget.style.backgroundColor = e.target.value; // Ubah gaya background via DOM
    });
    textInput.addEventListener('input', (e) => {
      boxTarget.innerText = e.target.value || 'Kotak Interaktif'; // Ubah teks via DOM
    });
  }

  // 3. Mini Todo List App
  const todoForm = document.getElementById('demo-todo-form');
  const todoInput = document.getElementById('demo-todo-input');
  const todoList = document.getElementById('demo-todo-list');

  if (todoForm && todoInput && todoList) {
    todoForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Mencegah reload halaman saat submit form
      const val = todoInput.value.trim();
      if (!val) return;

      // Buat elemen <li> baru secara dinamis
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.style.background = 'var(--bg-card)';
      li.style.color = 'var(--text-primary)';
      li.style.borderColor = 'var(--border-color)';
      li.innerHTML = `
        <span>${escapeHtml(val)}</span>
        <button class="btn btn-sm btn-danger del-todo-btn" style="background:#ef4444; color:white; border:none; border-radius:4px; padding:2px 8px;"><i class="fas fa-trash"></i></button>
      `;

      // Event listener tombol hapus item
      li.querySelector('.del-todo-btn').addEventListener('click', () => {
        li.remove();
      });

      todoList.appendChild(li); // Sisipkan elemen <li> ke dalam <ul>
      todoInput.value = '';
    });
  }
}

/**
 * Fungsi Pembantu: Mengamankan Teks dari Kerentanan XSS (Escaping Special Characters)
 * @param {string} str - Teks mentah masukan pengguna
 * @returns {string} Teks yang aman dirender ke dalam HTML
 */
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}
