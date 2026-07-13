import React from 'react';

export const NativeButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>((props, ref) => <button ref={ref} {...props} />);
NativeButton.displayName = 'NativeButton';

export const NativeSelect = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>((props, ref) => <select ref={ref} {...props} />);
NativeSelect.displayName = 'NativeSelect';

export const NativeInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => <input ref={ref} {...props} />);
NativeInput.displayName = 'NativeInput';

export const NativeTextarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>((props, ref) => <textarea ref={ref} {...props} />);
NativeTextarea.displayName = 'NativeTextarea';

export const NativeImg = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>((props, ref) => <img ref={ref} alt={props.alt || ""} {...props} />);
NativeImg.displayName = 'NativeImg';

export const NativeA = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>((props, ref) => <a ref={ref} {...props} />);
NativeA.displayName = 'NativeA';

export const NativeTable = React.forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>((props, ref) => <table ref={ref} {...props} />);
NativeTable.displayName = 'NativeTable';
