/**
 * Prompt Class.
 * Asks user for input, or show a confirmation dialog.
 */
export default class Prompt {

  // class constructor
  constructor( options ) {

    this._options = Object.assign({
      // title to show on prompt window
      title: 'Enter a value',
      // default value to be inserted
      value: '',
      // show confirm message instead of a prompt input
      confirm: '',
      // text for input placeholder
      inputText: 'Type here...',
      // text to show on accept button
      acceptText: 'Accept',
      // text to show on cancel button
      cancelText: 'Cancel',
      // function to call on accept
      onAccept: null,
      // function to call on cancel
      onCancel: null,
      // function to call on empty input
      onEmpty: null,
      // don't accept empty input values for prompts
      forceValue: true,
      // class used to animate loader in/out
      toggleClass: 'prompt-visible',
      // duration of css animation on show/hide toggle
      toggleDuration: 600,
      // z-index for loader when active
      zIndex: 99999,
      // ...
    }, options );

    this._title = document.createElement( 'div' );
    this._title.setAttribute( 'class', 'prompt-title' );
    this._title.innerHTML = this._options.title || '';

    this._message = document.createElement( 'div' );
    this._message.setAttribute( 'class', 'prompt-message' );
    this._message.innerHTML = this._options.confirm || '';

    this._input = document.createElement( 'input' );
    this._input.setAttribute( 'type', 'text' );
    this._input.setAttribute( 'placeholder', this._options.inputText );
    this._input.setAttribute( 'class', 'prompt-input' );
    this._input.value = this._options.value || '';

    this._accept = document.createElement( 'button' );
    this._accept.setAttribute( 'type', 'submit' );
    this._accept.setAttribute( 'class', 'prompt-accept-btn' );
    this._accept.innerHTML = this._options.acceptText;

    this._cancel = document.createElement( 'button' );
    this._cancel.setAttribute( 'type', 'button' );
    this._cancel.setAttribute( 'class', 'prompt-cancel-btn' );
    this._cancel.innerHTML = this._options.cancelText;

    this._buttons = document.createElement( 'div' );
    this._buttons.setAttribute( 'class', 'prompt-buttons' );
    this._buttons.appendChild( this._accept );
    this._buttons.appendChild( this._cancel );

    this._container = document.createElement( 'form' );
    this._container.setAttribute( 'class', 'prompt-container' );
    this._container.setAttribute( 'action', '#' );
    this._container.setAttribute( 'method', 'get' );
    this._container.addEventListener( 'submit', this._onAccept.bind( this ), true );
    this._container.appendChild( this._title );

    if ( this._options.confirm ) { this._container.appendChild( this._message ); }
    else { this._container.appendChild( this._input ); }
    this._container.appendChild( this._buttons );

    this._overlay = document.createElement( 'div' );
    this._overlay.setAttribute( 'class', 'prompt-overlay' );
    this._overlay.addEventListener( 'click', this._onCancel.bind( this ), true );
    this._overlay.appendChild( this._container );

    document.body.appendChild( this._overlay );

    setTimeout( () => {
      this._overlay.classList.add( this._options.toggleClass );
      this._input.selectionStart = this._input.selectionEnd = 10000;
      this._input.focus();
    }, 60 );
  }

  // remove prompt from page
  _remove() {
    this._overlay.classList.remove( this._options.toggleClass );

    setTimeout( () => {
      if ( document.body.contains( this._overlay ) ) {
        document.body.removeChild( this._overlay );
      }
    }, this._options.toggleDuration );
  }

  // on accept button
  _onAccept( e ) {
    e.preventDefault();

    if ( typeof this._options.onAccept === 'function' ) {
      let value = String( this._input.value || '' ).trim();

      if ( this._options.forceValue && !this._options.confirm && !value ) {
        if ( typeof this._options.onEmpty === 'function' ) {
          this._options.onEmpty( 'Must enter a value.' );
        }
        return;
      }
      this._options.onAccept( value );
    }
    this._remove();
  }

  // on cancel bubble
  _onCancel( e ) {
    if ( e.target === this._cancel || e.target === this._overlay ) {
      if ( typeof this._options.onCancel === 'function' ) {
        this._options.onCancel( this._input.value );
      }
      this._remove();
    }
  }

}
