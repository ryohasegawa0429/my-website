/**
 * 生成AI業務効率化ラボ - メインJavaScript v1.1
 * モダンES6+構文を使用したインタラクティブ機能の実装
 */

'use strict';

/**
 * メインサイトコントローラークラス
 * サイト全体のインタラクティブ機能を管理
 */
class SiteController {
  constructor() {
    this.isInitialized = false;
    this.intersectionObserver = null;
    this.scrollObserver = null;
    this.currentSection = null;
    
    // 初期化
    this.init();
  }

  /**
   * 初期化メソッド
   * DOMContentLoadedイベントを待ってから各機能を初期化
   */
  async init() {
    try {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setupComponents());
      } else {
        this.setupComponents();
      }
    } catch (error) {
      console.error('SiteController initialization failed:', error);
    }
  }

  /**
   * 各コンポーネントのセットアップ
   */
  setupComponents() {
    console.log('🚀 Site initialization started...');

    try {
      // 基本機能のセットアップ
      this.setupSmoothScroll();
      this.setupIntersectionObserver();
      this.setupScrollToTop();
      this.setupMobileMenu();
      this.setupFAQ();
      this.setupFormValidation();
      this.setupAnimations();
      this.setupHeaderScrollEffect();
      this.setupActiveNavigation();
      
      // 初期化完了フラグ
      this.isInitialized = true;
      console.log('✅ Site initialization completed successfully');
      
    } catch (error) {
      console.error('❌ Site setup failed:', error);
    }
  }

  /**
   * スムーススクロールの実装
   * アンカーリンクによるスムーズな画面遷移
   */
  setupSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // フォーカス管理（アクセシビリティ）
          setTimeout(() => {
            targetElement.focus({ preventScroll: true });
          }, 500);
        }
      });
    });
    
    console.log(`📍 Smooth scroll setup completed for ${anchorLinks.length} links`);
  }

  /**
   * Intersection Observer による要素の可視化検出
   * スクロールアニメーション、遅延読み込みなどに使用
   */
  setupIntersectionObserver() {
    // 基本設定
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    // メインのIntersection Observer
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // アニメーション開始
          entry.target.classList.add('animate-in');
          
          // パフォーマンス向上のため、一度アニメーションした要素は監視停止
          this.intersectionObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // アニメーション対象要素を監視開始
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => {
      this.intersectionObserver.observe(el);
    });

    // 遅延読み込み画像の処理
    this.setupLazyLoading();
    
    console.log(`👁️ Intersection Observer setup for ${animateElements.length} elements`);
  }

  /**
   * 遅延読み込み（Lazy Loading）の実装
   */
  setupLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if (lazyImages.length === 0) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // 画像ソースの置換
          img.src = img.dataset.src;
          img.classList.add('loaded');
          
          // srcset対応
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
          
          // 監視停止
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
    
    console.log(`🖼️ Lazy loading setup for ${lazyImages.length} images`);
  }

  /**
   * ページトップに戻るボタンの実装
   */
  setupScrollToTop() {
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    if (!scrollToTopBtn) return;

    // スクロール監視
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      // パフォーマンス向上のためのthrottling
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      scrollTimeout = setTimeout(() => {
        const scrollPosition = window.pageYOffset;
        
        if (scrollPosition > 300) {
          scrollToTopBtn.classList.add('is-visible');
        } else {
          scrollToTopBtn.classList.remove('is-visible');
        }
      }, 100);
    });

    // クリックイベント
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // フォーカス管理
      document.querySelector('h1')?.focus({ preventScroll: true });
    });
    
    console.log('⬆️ Scroll to top button setup completed');
  }

  /**
   * モバイルメニューの実装
   */
  setupMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;
    
    if (!menuToggle) return;

    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.classList.contains('is-active');
      
      // トグル状態の切り替え
      menuToggle.classList.toggle('is-active');
      menuToggle.setAttribute('aria-expanded', !isOpen);
      
      if (mobileMenu) {
        mobileMenu.classList.toggle('is-open');
      }
      
      // ボディスクロール制御
      body.classList.toggle('menu-open');
      
      // アクセシビリティ: フォーカス管理
      if (!isOpen) {
        menuToggle.focus();
      }
    });

    // ESCキーでメニューを閉じる
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuToggle.classList.contains('is-active')) {
        menuToggle.click();
      }
    });

    // メニュー外クリックで閉じる
    document.addEventListener('click', (e) => {
      if (mobileMenu && 
          !mobileMenu.contains(e.target) && 
          !menuToggle.contains(e.target) && 
          menuToggle.classList.contains('is-active')) {
        menuToggle.click();
      }
    });
    
    console.log('📱 Mobile menu setup completed');
  }

  /**
   * FAQアコーディオンの実装
   */
  setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      
      if (!question || !answer) return;

      question.addEventListener('click', () => {
        const isOpen = question.getAttribute('aria-expanded') === 'true';
        
        // 他のFAQを閉じる（アコーディオン動作）
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            const otherQuestion = otherItem.querySelector('.faq-question');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            
            otherQuestion.setAttribute('aria-expanded', 'false');
            otherAnswer.classList.remove('is-open');
          }
        });
        
        // 現在のアイテムをトグル
        question.setAttribute('aria-expanded', !isOpen);
        answer.classList.toggle('is-open');
        
        // アニメーション完了後にフォーカス調整
        if (!isOpen) {
          setTimeout(() => {
            answer.focus({ preventScroll: true });
          }, 300);
        }
      });

      // キーボードナビゲーション対応
      question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
        }
      });
    });
    
    console.log(`❓ FAQ accordion setup for ${faqItems.length} items`);
  }

  /**
   * フォームバリデーションのセットアップ
   */
  setupFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      new FormValidator(form);
    });
    
    console.log(`📝 Form validation setup for ${forms.length} forms`);
  }

  /**
   * アニメーション効果のセットアップ
   */
  setupAnimations() {
    // CSS animation classes を動的に適用
    const animationTriggers = document.querySelectorAll('[data-animation]');
    
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const animationType = entry.target.dataset.animation;
          entry.target.classList.add(animationType);
          animationObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    animationTriggers.forEach(el => {
      animationObserver.observe(el);
    });
    
    console.log(`✨ Animation setup for ${animationTriggers.length} elements`);
  }

  /**
   * ヘッダースクロール効果
   */
  setupHeaderScrollEffect() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let scrollTimeout;

    window.addEventListener('scroll', () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      scrollTimeout = setTimeout(() => {
        const currentScrollY = window.scrollY;
        
        // スクロール方向に応じてヘッダーの表示制御
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          header.style.transform = 'translateY(-100%)';
        } else {
          header.style.transform = 'translateY(0)';
        }
        
        // スクロール位置に応じて背景の透明度調整
        const opacity = Math.min(currentScrollY / 100, 0.98);
        header.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
        
        lastScrollY = currentScrollY;
      }, 100);
    });
    
    console.log('📜 Header scroll effect setup completed');
  }

  /**
   * アクティブナビゲーションの実装
   */
  setupActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    if (sections.length === 0) return;

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          this.currentSection = id;
          
          // すべてのナビリンクからアクティブクラスを削除
          navLinks.forEach(link => {
            link.classList.remove('active');
          });
          
          // 対応するナビリンクにアクティブクラスを追加
          const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
          if (activeLink) {
            activeLink.classList.add('active');
          }
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(section => {
      navObserver.observe(section);
    });
    
    console.log('🧭 Active navigation setup completed');
  }

  /**
   * パフォーマンス監視とエラーハンドリング
   */
  monitorPerformance() {
    // Core Web Vitals の監視
    if ('web-vital' in window) {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    }

    // JavaScript エラーの監視
    window.addEventListener('error', (e) => {
      console.error('JavaScript Error:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error
      });
    });

    // Promise rejection の監視
    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled Promise Rejection:', e.reason);
    });
  }

  /**
   * パブリックメソッド: 外部からのアクセス用
   */
  
  /**
   * 特定セクションにスムーズスクロール
   * @param {string} sectionId - セクションID
   */
  scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
      const targetPosition = element.offsetTop - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  /**
   * FAQの特定項目を開く
   * @param {number} index - FAQ項目のインデックス
   */
  openFAQ(index) {
    const faqItems = document.querySelectorAll('.faq-item');
    const targetItem = faqItems[index];
    
    if (targetItem) {
      const question = targetItem.querySelector('.faq-question');
      if (question) {
        question.click();
      }
    }
  }

  /**
   * 現在のセクション取得
   * @returns {string} 現在のセクションID
   */
  getCurrentSection() {
    return this.currentSection;
  }

  /**
   * 初期化状態の確認
   * @returns {boolean} 初期化済みかどうか
   */
  isReady() {
    return this.isInitialized;
  }
}

/**
 * フォームバリデーションクラス
 * リアルタイムバリデーション、送信処理、エラーハンドリング
 */
class FormValidator {
  constructor(form) {
    this.form = form;
    this.errors = new Map();
    this.isSubmitting = false;
    
    this.init();
  }

  /**
   * フォームバリデーションの初期化
   */
  init() {
    this.setupEventListeners();
    this.setupRealTimeValidation();
    console.log('📋 Form validator initialized for:', this.form.id || 'unnamed form');
  }

  /**
   * イベントリスナーのセットアップ
   */
  setupEventListeners() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // リアルタイムバリデーション
    const inputs = this.form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  /**
   * リアルタイムバリデーションのセットアップ
   */
  setupRealTimeValidation() {
    const inputs = this.form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      // 入力文字数のリアルタイム表示
      if (input.type === 'textarea' || input.type === 'text') {
        this.setupCharacterCount(input);
      }
      
      // パスワード強度チェック（該当する場合）
      if (input.type === 'password') {
        this.setupPasswordStrength(input);
      }
    });
  }

  /**
   * 文字数カウンターのセットアップ
   * @param {HTMLElement} input - 対象の入力要素
   */
  setupCharacterCount(input) {
    const maxLength = input.getAttribute('maxlength');
    if (!maxLength) return;

    // カウンター要素を作成
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.fontSize = 'var(--font-size-xs)';
    counter.style.color = 'var(--color-text-light)';
    counter.style.textAlign = 'right';
    counter.style.marginTop = 'var(--space-xs)';
    
    input.parentNode.appendChild(counter);

    // リアルタイム更新
    const updateCounter = () => {
      const current = input.value.length;
      const max = parseInt(maxLength);
      counter.textContent = `${current}/${max}文字`;
      
      if (current > max * 0.9) {
        counter.style.color = 'var(--color-warning)';
      } else {
        counter.style.color = 'var(--color-text-light)';
      }
    };

    input.addEventListener('input', updateCounter);
    updateCounter(); // 初期表示
  }

  /**
   * パスワード強度チェック
   * @param {HTMLElement} input - パスワード入力要素
   */
  setupPasswordStrength(input) {
    const strengthMeter = document.createElement('div');
    strengthMeter.className = 'password-strength';
    input.parentNode.appendChild(strengthMeter);

    input.addEventListener('input', () => {
      const strength = this.calculatePasswordStrength(input.value);
      this.displayPasswordStrength(strengthMeter, strength);
    });
  }

  /**
   * パスワード強度計算
   * @param {string} password - パスワード
   * @returns {Object} 強度情報
   */
  calculatePasswordStrength(password) {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[^a-zA-Z0-9]/.test(password)
    };

    score = Object.values(checks).filter(Boolean).length;

    return {
      score,
      checks,
      level: score < 2 ? 'weak' : score < 4 ? 'medium' : 'strong'
    };
  }

  /**
   * 個別フィールドのバリデーション
   * @param {HTMLElement} field - バリデーション対象フィールド
   * @returns {boolean} バリデーション結果
   */
  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const fieldType = field.type;
    let isValid = true;

    // 必須フィールドチェック
    if (field.hasAttribute('required') && !value) {
      this.setFieldError(field, 'この項目は必須です');
      return false;
    }

    // フィールドタイプ別バリデーション
    switch (fieldType) {
      case 'email':
        if (value && !this.isValidEmail(value)) {
          this.setFieldError(field, '正しいメールアドレスを入力してください');
          isValid = false;
        }
        break;
      
      case 'tel':
        if (value && !this.isValidPhone(value)) {
          this.setFieldError(field, '正しい電話番号を入力してください（例: 090-1234-5678）');
          isValid = false;
        }
        break;
      
      case 'url':
        if (value && !this.isValidURL(value)) {
          this.setFieldError(field, '正しいURLを入力してください');
          isValid = false;
        }
        break;
      
      default:
        // カスタムバリデーション属性のチェック
        if (field.hasAttribute('data-min-length')) {
          const minLength = parseInt(field.getAttribute('data-min-length'));
          if (value.length < minLength) {
            this.setFieldError(field, `${minLength}文字以上で入力してください`);
            isValid = false;
          }
        }
    }

    // 正常な場合はエラーをクリア
    if (isValid) {
      this.clearFieldError(field);
    }

    return isValid;
  }

  /**
   * メールアドレスの妥当性チェック
   * @param {string} email - メールアドレス
   * @returns {boolean} 妥当性
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 電話番号の妥当性チェック
   * @param {string} phone - 電話番号
   * @returns {boolean} 妥当性
   */
  isValidPhone(phone) {
    const phoneRegex = /^[\d\-\(\)\+\s]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }

  /**
   * URLの妥当性チェック
   * @param {string} url - URL
   * @returns {boolean} 妥当性
   */
  isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * フィールドエラーの設定
   * @param {HTMLElement} field - 対象フィールド
   * @param {string} message - エラーメッセージ
   */
  setFieldError(field, message) {
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      errorElement.setAttribute('role', 'alert');
    }
    
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    this.errors.set(field.name, message);
  }

  /**
   * フィールドエラーのクリア
   * @param {HTMLElement} field - 対象フィールド
   */
  clearFieldError(field) {
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
      errorElement.style.display = 'none';
      errorElement.removeAttribute('role');
    }
    
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');
    this.errors.delete(field.name);
  }

  /**
   * フォーム送信処理
   * @param {Event} e - 送信イベント
   */
  async handleSubmit(e) {
    e.preventDefault();
    
    if (this.isSubmitting) return;
    
    // 全フィールドのバリデーション
    const isValid = this.validateForm();
    
    if (isValid) {
      await this.submitForm();
    } else {
      // エラーがある場合、最初のエラーフィールドにフォーカス
      const firstErrorField = this.form.querySelector('.error');
      if (firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  /**
   * フォーム全体のバリデーション
   * @returns {boolean} バリデーション結果
   */
  validateForm() {
    const inputs = this.form.querySelectorAll('input, textarea, select');
    let isValid = true;

    // 全フィールドをチェック
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * フォーム送信実行
   */
  async submitForm() {
    const submitBtn = this.form.querySelector('button[type="submit"]');
    const originalText = submitBtn?.textContent || '';
    
    try {
      this.isSubmitting = true;
      
      // UI更新: 送信中状態
      if (submitBtn) {
        submitBtn.textContent = '送信中...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
      }

      // フォームデータの収集
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());
      
      // 送信処理（実際のAPIエンドポイントに合わせて修正）
      const response = await this.sendFormData(data);

      if (response.success) {
        this.showSuccessMessage();
        this.form.reset();
        this.errors.clear();
        
        // 成功時のアナリティクス追跡
        this.trackFormSubmission('success');
        
      } else {
        throw new Error(response.message || '送信に失敗しました');
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      this.showErrorMessage(error.message);
      
      // エラー時のアナリティクス追跡
      this.trackFormSubmission('error', error.message);
      
    } finally {
      this.isSubmitting = false;
      
      // UI復元
      if (submitBtn) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
      }
    }
  }

  /**
   * フォームデータの送信
   * @param {Object} data - 送信データ
   * @returns {Promise<Object>} 送信結果
   */
  async sendFormData(data) {
    // 実際の実装では、サーバーサイドのAPIエンドポイントを呼び出し
    // ここではモックレスポンスを返す
    
    // シミュレート: ネットワーク遅延
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // バリデーション: 必要なフィールドのチェック
    if (!data.name || !data.email || !data.message) {
      return {
        success: false,
        message: '必須項目が入力されていません'
      };
    }
    
    // 成功レスポンス
    return {
      success: true,
      message: 'お問い合わせを受け付けました'
    };
  }

  /**
   * 成功メッセージの表示
   */
  showSuccessMessage() {
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.setAttribute('role', 'alert');
    successMsg.innerHTML = `
      <i class="bi bi-check-circle-fill" style="margin-right: 0.5rem;"></i>
      お問い合わせありがとうございます。24時間以内にご連絡いたします。
    `;
    
    this.form.parentNode.insertBefore(successMsg, this.form);
    
    // 成功メッセージにフォーカス（アクセシビリティ）
    successMsg.focus();
    
    // 3秒後に自動で消去
    setTimeout(() => {
      successMsg.remove();
    }, 5000);
  }

  /**
   * エラーメッセージの表示
   * @param {string} message - エラーメッセージ
   */
  showErrorMessage(message) {
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message-global';
    errorMsg.setAttribute('role', 'alert');
    errorMsg.innerHTML = `
      <i class="bi bi-exclamation-triangle-fill" style="margin-right: 0.5rem;"></i>
      ${message}
    `;
    
    this.form.parentNode.insertBefore(errorMsg, this.form);
    
    // エラーメッセージにフォーカス（アクセシビリティ）
    errorMsg.focus();
    
    // 5秒後に自動で消去
    setTimeout(() => {
      errorMsg.remove();
    }, 5000);
  }

  /**
   * フォーム送信のアナリティクス追跡
   * @param {string} status - 送信状況
   * @param {string} error - エラーメッセージ（エラー時のみ）
   */
  trackFormSubmission(status, error = null) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'form_submit', {
        event_category: 'engagement',
        event_label: this.form.id || 'contact_form',
        custom_parameter_1: status,
        custom_parameter_2: error
      });
    }
    
    console.log(`📊 Form submission tracked: ${status}`, error ? { error } : '');
  }
}

/**
 * ユーティリティ関数群
 */
class Utils {
  /**
   * デバウンス関数
   * @param {Function} func - 実行する関数
   * @param {number} wait - 待機時間（ミリ秒）
   * @param {boolean} immediate - 即座実行フラグ
   * @returns {Function} デバウンスされた関数
   */
  static debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  }

  /**
   * スロットル関数
   * @param {Function} func - 実行する関数
   * @param {number} limit - 制限時間（ミリ秒）
   * @returns {Function} スロットルされた関数
   */
  static throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * 要素の可視性チェック
   * @param {HTMLElement} element - チェック対象要素
   * @returns {boolean} 可視性
   */
  static isElementVisible(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * クッキーの取得
   * @param {string} name - クッキー名
   * @returns {string|null} クッキー値
   */
  static getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  /**
   * クッキーの設定
   * @param {string} name - クッキー名
   * @param {string} value - クッキー値
   * @param {number} days - 有効期限（日数）
   */
  static setCookie(name, value, days = 7) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }

  /**
   * ローカルストレージの安全な使用
   * @param {string} key - キー
   * @param {any} value - 値（設定時）
   * @returns {any} 値（取得時）
   */
  static storage(key, value = undefined) {
    try {
      if (value !== undefined) {
        localStorage.setItem(key, JSON.stringify(value));
        return value;
      } else {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      }
    } catch (error) {
      console.warn('LocalStorage not available:', error);
      return null;
    }
  }

  /**
   * URL パラメータの取得
   * @param {string} param - パラメータ名
   * @returns {string|null} パラメータ値
   */
  static getUrlParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  /**
   * 数値のフォーマット（3桁区切り）
   * @param {number} num - 数値
   * @returns {string} フォーマット済み文字列
   */
  static formatNumber(num) {
    return num.toLocaleString('ja-JP');
  }

  /**
   * 日付のフォーマット
   * @param {Date} date - 日付オブジェクト
   * @param {string} format - フォーマット形式
   * @returns {string} フォーマット済み日付
   */
  static formatDate(date, format = 'YYYY/MM/DD') {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day);
  }
}

/**
 * パフォーマンス監視クラス
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.init();
  }

  init() {
    this.observePerformance();
    this.setupErrorTracking();
  }

  /**
   * パフォーマンス観測の開始
   */
  observePerformance() {
    // Navigation Timing API
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        
        this.metrics.set('pageLoadTime', {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          totalTime: navigation.loadEventEnd - navigation.navigationStart
        });
        
        this.reportMetrics();
      }, 0);
    });

    // Resource Timing API
    this.observeResources();

    // User Timing API
    this.markCustomTimings();
  }

  /**
   * リソース読み込み監視
   */
  observeResources() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 1000) { // 1秒以上かかるリソース
          console.warn('Slow resource detected:', {
            name: entry.name,
            duration: entry.duration,
            size: entry.transferSize
          });
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  /**
   * カスタムタイミングマーク
   */
  markCustomTimings() {
    // JavaScript実行開始
    performance.mark('js-start');
    
    // 初期化完了時
    document.addEventListener('DOMContentLoaded', () => {
      performance.mark('dom-ready');
      performance.measure('dom-load-time', 'navigationStart', 'dom-ready');
    });
  }

  /**
   * エラー追跡の設定
   */
  setupErrorTracking() {
    // JavaScript エラー
    window.addEventListener('error', (e) => {
      this.trackError('javascript', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error?.stack
      });
    });

    // Promise rejection
    window.addEventListener('unhandledrejection', (e) => {
      this.trackError('promise', {
        reason: e.reason,
        promise: e.promise
      });
    });

    // Resource エラー
    window.addEventListener('error', (e) => {
      if (e.target !== window) {
        this.trackError('resource', {
          element: e.target.tagName,
          source: e.target.src || e.target.href,
          message: 'Failed to load resource'
        });
      }
    }, true);
  }

  /**
   * エラーの記録
   * @param {string} type - エラータイプ
   * @param {Object} details - エラー詳細
   */
  trackError(type, details) {
    const errorData = {
      type,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...details
    };

    console.error(`Error tracked (${type}):`, errorData);

    // 外部サービスへの送信（例：Google Analytics、Sentry等）
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: `${type}: ${details.message || details.reason}`,
        fatal: false
      });
    }
  }

  /**
   * メトリクスのレポート
   */
  reportMetrics() {
    console.group('📊 Performance Metrics');
    this.metrics.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
    console.groupEnd();
  }
}

/**
 * アナリティクス・追跡クラス
 */
class Analytics {
  constructor() {
    this.events = [];
    this.sessionStart = Date.now();
    this.init();
  }

  init() {
    this.setupPageTracking();
    this.setupUserInteractionTracking();
    this.setupScrollTracking();
  }

  /**
   * ページビュー追跡
   */
  setupPageTracking() {
    // 初回ページビュー
    this.trackPageView();

    // SPA対応: ヒストリー変更の監視
    window.addEventListener('popstate', () => {
      this.trackPageView();
    });
  }

  /**
   * ユーザーインタラクション追跡
   */
  setupUserInteractionTracking() {
    // CTA ボタンクリック
    document.addEventListener('click', (e) => {
      const button = e.target.closest('.cta-button');
      if (button) {
        this.trackEvent('cta_click', {
          button_text: button.textContent.trim(),
          section: this.getCurrentSection(button)
        });
      }

      // ナビゲーションクリック
      const navLink = e.target.closest('.nav-link');
      if (navLink) {
        this.trackEvent('navigation_click', {
          target_section: navLink.getAttribute('href'),
          source_section: this.getCurrentSection(navLink)
        });
      }

      // 電話番号クリック
      const phoneLink = e.target.closest('a[href^="tel:"]');
      if (phoneLink) {
        this.trackEvent('phone_click', {
          phone_number: phoneLink.getAttribute('href')
        });
      }

      // メールリンククリック
      const emailLink = e.target.closest('a[href^="mailto:"]');
      if (emailLink) {
        this.trackEvent('email_click', {
          email_address: emailLink.getAttribute('href')
        });
      }
    });

    // FAQ展開追跡
    document.addEventListener('click', (e) => {
      const faqQuestion = e.target.closest('.faq-question');
      if (faqQuestion) {
        const faqItem = faqQuestion.closest('.faq-item');
        const faqIndex = Array.from(document.querySelectorAll('.faq-item')).indexOf(faqItem);
        
        this.trackEvent('faq_toggle', {
          question_index: faqIndex,
          question_text: faqQuestion.textContent.trim().substring(0, 50)
        });
      }
    });
  }

  /**
   * スクロール追跡
   */
  setupScrollTracking() {
    const scrollMilestones = [25, 50, 75, 90, 100];
    const trackedMilestones = new Set();

    const trackScrollProgress = Utils.throttle(() => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      scrollMilestones.forEach(milestone => {
        if (scrollPercent >= milestone && !trackedMilestones.has(milestone)) {
          trackedMilestones.add(milestone);
          this.trackEvent('scroll_progress', {
            percentage: milestone
          });
        }
      });
    }, 1000);

    window.addEventListener('scroll', trackScrollProgress);
  }

  /**
   * イベントの追跡
   * @param {string} eventName - イベント名
   * @param {Object} parameters - パラメータ
   */
  trackEvent(eventName, parameters = {}) {
    const eventData = {
      event: eventName,
      timestamp: Date.now(),
      session_duration: Date.now() - this.sessionStart,
      page_url: window.location.href,
      ...parameters
    };

    this.events.push(eventData);

    // Google Analytics 4 への送信
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, parameters);
    }

    console.log('📈 Event tracked:', eventData);
  }

  /**
   * ページビューの追跡
   */
  trackPageView() {
    const pageData = {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname
    };

    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', pageData);
    }

    console.log('📄 Page view tracked:', pageData);
  }

  /**
   * 現在のセクション取得
   * @param {HTMLElement} element - 基準要素
   * @returns {string} セクション名
   */
  getCurrentSection(element) {
    const section = element.closest('section[id]');
    return section ? section.id : 'unknown';
  }

  /**
   * コンバージョン追跡
   * @param {string} conversionType - コンバージョンタイプ
   * @param {Object} details - 詳細情報
   */
  trackConversion(conversionType, details = {}) {
    this.trackEvent('conversion', {
      conversion_type: conversionType,
      ...details
    });

    // Google Analytics Enhanced Ecommerce（必要に応じて）
    if (typeof gtag !== 'undefined') {
      gtag('event', 'purchase', {
        transaction_id: `conv_${Date.now()}`,
        value: details.value || 0,
        currency: 'JPY',
        items: [{
          item_id: conversionType,
          item_name: details.service_name || conversionType,
          category: 'conversion',
          quantity: 1,
          price: details.value || 0
        }]
      });
    }
  }

  /**
   * セッション終了時の処理
   */
  endSession() {
    const sessionData = {
      session_duration: Date.now() - this.sessionStart,
      events_count: this.events.length,
      final_url: window.location.href
    };

    this.trackEvent('session_end', sessionData);
  }
}

/**
 * A/Bテスト管理クラス
 */
class ABTestManager {
  constructor() {
    this.tests = new Map();
    this.userVariant = null;
    this.init();
  }

  init() {
    this.loadUserVariant();
    this.setupTests();
  }

  /**
   * ユーザーバリアント読み込み
   */
  loadUserVariant() {
    // 既存のバリアントがあるかチェック
    this.userVariant = Utils.storage('ab_test_variant');
    
    if (!this.userVariant) {
      // 新規ユーザーの場合、バリアントを決定
      this.userVariant = Math.random() < 0.5 ? 'A' : 'B';
      Utils.storage('ab_test_variant', this.userVariant);
    }

    console.log(`🧪 A/B Test Variant: ${this.userVariant}`);
  }

  /**
   * テストの設定
   */
  setupTests() {
    // ヘッドライン A/B テスト
    this.defineTest('headline_test', {
      A: '現場目線で解決します',
      B: '一緒に解決しませんか？'
    });

    // CTA ボタン A/B テスト
    this.defineTest('cta_color_test', {
      A: 'default', // CSS変数のデフォルト色
      B: 'alternative' // 代替色
    });

    // 適用
    this.applyTests();
  }

  /**
   * テストの定義
   * @param {string} testName - テスト名
   * @param {Object} variants - バリアント設定
   */
  defineTest(testName, variants) {
    this.tests.set(testName, {
      variants,
      activeVariant: this.userVariant
    });
  }

  /**
   * テストの適用
   */
  applyTests() {
    this.tests.forEach((test, testName) => {
      const variant = test.activeVariant;
      
      switch (testName) {
        case 'headline_test':
          this.applyHeadlineTest(test.variants[variant]);
          break;
        case 'cta_color_test':
          this.applyCTAColorTest(variant);
          break;
      }
      
      // Analytics に記録
      if (typeof gtag !== 'undefined') {
        gtag('event', 'ab_test_view', {
          test_name: testName,
          variant: variant
        });
      }
    });
  }

  /**
   * ヘッドラインテストの適用
   * @param {string} headlineText - ヘッドライン文言
   */
  applyHeadlineTest(headlineText) {
    const headline = document.querySelector('.hero-section__title');
    if (headline) {
      headline.textContent = `AIの悩み、${headlineText}`;
    }
  }

  /**
   * CTAボタン色テストの適用
   * @param {string} variant - バリアント
   */
  applyCTAColorTest(variant) {
    if (variant === 'B') {
      document.documentElement.style.setProperty('--color-secondary', '#4CAF50');
    }
  }

  /**
   * コンバージョンの記録
   * @param {string} testName - テスト名
   */
  recordConversion(testName) {
    const test = this.tests.get(testName);
    if (test) {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'ab_test_conversion', {
          test_name: testName,
          variant: test.activeVariant
        });
      }
      
      console.log(`💰 A/B Test Conversion: ${testName} - ${test.activeVariant}`);
    }
  }
}

/**
 * アクセシビリティ強化クラス
 */
class AccessibilityEnhancer {
  constructor() {
    this.init();
  }

  init() {
    this.setupKeyboardNavigation();
    this.setupScreenReaderSupport();
    this.setupFocusManagement();
    this.setupReducedMotionSupport();
  }

  /**
   * キーボードナビゲーション強化
   */
  setupKeyboardNavigation() {
    // Escキーでモーダル・メニューを閉じる
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // モバイルメニューを閉じる
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle.is-active');
        if (mobileMenuToggle) {
          mobileMenuToggle.click();
        }

        // 開いているFAQを閉じる
        const openFAQ = document.querySelector('.faq-question[aria-expanded="true"]');
        if (openFAQ) {
          openFAQ.click();
        }
      }
    });

    // Tab キーでのフォーカス可視化強化
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  /**
   * スクリーンリーダー対応強化
   */
  setupScreenReaderSupport() {
    // 動的コンテンツの読み上げ通知
    this.setupLiveRegions();
    
    // 画像の代替テキスト自動検証
    this.validateImageAltText();
    
    // フォームラベルの関連付け検証
    this.validateFormLabels();
  }

  /**
   * ライブリージョンの設定
   */
  setupLiveRegions() {
    // 汎用的なライブリージョンを作成
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
  }

  /**
   * ライブリージョンへの通知
   * @param {string} message - 通知メッセージ
   */
  announceToScreenReader(message) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      
      // 一定時間後にクリア
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  /**
   * 画像代替テキストの検証
   */
  validateImageAltText() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.alt && !img.getAttribute('aria-hidden')) {
        console.warn('Image missing alt text:', img.src);
      }
    });
  }

  /**
   * フォームラベルの検証
   */
  validateFormLabels() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      const label = document.querySelector(`label[for="${input.id}"]`);
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledby = input.getAttribute('aria-labelledby');
      
      if (!label && !ariaLabel && !ariaLabelledby) {
        console.warn('Form control missing label:', input);
      }
    });
  }

  /**
   * フォーカス管理
   */
  setupFocusManagement() {
    // フォーカストラップ（モーダル等で使用）
    this.setupFocusTrap();
    
    // フォーカス可視化の改善
    this.enhanceFocusVisibility();
  }

  /**
   * フォーカストラップの設定
   */
  setupFocusTrap() {
    // 将来のモーダル実装時に使用
    // 現在は基本的なフォーカス管理のみ
  }

  /**
   * フォーカス可視化の強化
   */
  enhanceFocusVisibility() {
    // カスタムフォーカススタイル
    const style = document.createElement('style');
    style.textContent = `
      .keyboard-navigation *:focus {
        outline: 3px solid var(--color-primary) !important;
        outline-offset: 2px !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * モーション軽減設定対応
   */
  setupReducedMotionSupport() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      document.body.classList.add('reduced-motion');
      console.log('♿ Reduced motion preferences detected');
    }

    // 設定変更の監視
    prefersReducedMotion.addListener((e) => {
      if (e.matches) {
        document.body.classList.add('reduced-motion');
      } else {
        document.body.classList.remove('reduced-motion');
      }
    });
  }
}

/**
 * メイン初期化処理
 */
(function initializeApp() {
  console.log('🚀 Initializing AI Efficiency Lab website...');

  // グローバル変数として各インスタンスを作成
  window.siteController = new SiteController();
  window.performanceMonitor = new PerformanceMonitor();
  window.analytics = new Analytics();
  window.abTestManager = new ABTestManager();
  window.accessibilityEnhancer = new AccessibilityEnhancer();

  // ページ離脱時の処理
  window.addEventListener('beforeunload', () => {
    if (window.analytics) {
      window.analytics.endSession();
    }
  });

  // エラーハンドリング
  window.addEventListener('error', (e) => {
    console.error('Global error caught:', e.error);
  });

  console.log('✅ AI Efficiency Lab website initialization completed');
})();

/**
 * パブリック API（外部から利用可能な関数）
 */
window.AIEfficiencyLab = {
  // 基本機能
  scrollToSection: (sectionId) => window.siteController?.scrollToSection(sectionId),
  openFAQ: (index) => window.siteController?.openFAQ(index),
  
  // Analytics
  trackEvent: (eventName, parameters) => window.analytics?.trackEvent(eventName, parameters),
  trackConversion: (type, details) => window.analytics?.trackConversion(type, details),
  
  // A/B Testing
  recordConversion: (testName) => window.abTestManager?.recordConversion(testName),
  
  // Accessibility
  announce: (message) => window.accessibilityEnhancer?.announceToScreenReader(message),
  
  // Utilities
  utils: Utils,
  
  // 状態確認
  isReady: () => window.siteController?.isReady() || false
};

// デバッグ用（開発環境のみ）
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.debug = {
    siteController: window.siteController,
    performanceMonitor: window.performanceMonitor,
    analytics: window.analytics,
    abTestManager: window.abTestManager,
    accessibilityEnhancer: window.accessibilityEnhancer
  };
  
  console.log('🔧 Debug mode enabled. Access via window.debug');
}
    