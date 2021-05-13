import { renderHook, act } from '@testing-library/react-hooks';
import useCountdown from './useCountdown';

describe('useCountdown', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    it('should use countdown', () => {
        const { result } = renderHook(() => useCountdown());
    
        expect(result.current.countdown).toBe(0);
        expect(typeof result.current.start).toBe('function');
        expect(typeof result.current.stop).toBe('function');
    });
    
    it('should start countdown', () => {
        const callback = jest.fn();
        const { result } = renderHook(() => useCountdown());
    
        act(() => result.current.start(10, callback));

        expect(callback).not.toBeCalled();
        expect(result.current.countdown).toBe(10);

        act(() => { jest.advanceTimersByTime(1000) });
        expect(callback).not.toBeCalled();
        expect(result.current.countdown).toBe(9);
    
        act(() => { jest.advanceTimersByTime(1000) });
        expect(callback).not.toBeCalled();
        expect(result.current.countdown).toBe(8);

        act(() => { jest.runAllTimers() });
    });

    it('should start and end countdown', () => {
        const callback = jest.fn();
        const { result } = renderHook(() => useCountdown());
    
        act(() => result.current.start(10, callback));

        expect(callback).not.toBeCalled();

        act(() => { jest.runAllTimers() });
        expect(result.current.countdown).toBe(0);
        expect(callback).toBeCalled();
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should not start timer with zero arguments', () => {
        const callback = jest.fn();
        const { result } = renderHook(() => useCountdown());
    
        act(() => result.current.start(0, callback));

        act(() => { jest.runAllTimers() });

        expect(result.current.countdown).toBe(0);
        expect(callback).not.toBeCalled();
    });

    it('should stop timer', () => {
        const callback = jest.fn();
        const { result } = renderHook(() => useCountdown());
        
        act(() => result.current.start(10, callback));

        act(() => { jest.advanceTimersByTime(5000) });

        act(() => result.current.stop());

        expect(result.current.countdown).toBe(0);
        expect(callback).not.toBeCalled();
    });
});