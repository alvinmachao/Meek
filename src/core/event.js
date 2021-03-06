/**
 * Created by zypc on 2016/11/13.
 */

 // The event processor for all subclasss, which can allow subclass
 // to handle event dispatching and listening.This is the top level class
/**
 * 顶层事件处理器类,让子类具备事件的监听和派发
 *
 * @class Event
 * @module core
 * @constructor new Event()
 *
 */
export default class Event {
  
  /**
   * Event's constructor
   * @constructor constructor
   */
  constructor () {
    this._pendingRemovals = {}

    this._listeners = {}
    this._dispatching = {}

    this.nullFunction = function () {}
  }
  
  /**
   * 根据事件标识获取对应标识的方法列表
   *
   * @method getListeners
   * @param type {String} event type 事件标识
   * @return {Array} 返回对应事件标示的函数数组
   */
  getListeners (type) {
    return this._listeners[type]
  }
  
  /**
   * 判断是否含有对应事件标识的监听
   *
   * @method hasListener
   * @param optType {Boolean}
   * @returns {Boolean} ture if exsit ,false otherwise
   */
  hasListener (optType) {
    return optType ?
      Reflect.has(this._listeners, optType) :
      Object.keys(this._listeners).length > 0
  }

  /**
   * 移除事件监听
   *
   * @method removeEventListener
   * @param type {String} event type
   * @param listener {Array} listeners for event type
   */
  removeEventListener (type, listener) {
    const listeners = this._listeners[type]
    if (listeners) {
      let index = listeners.indexOf(listener)

      if (Reflect.has(this._pendingRemovals, type)) {
        listeners[index] = this.nullFunction
        ++this._pendingRemovals[type]
      } else {
        listeners.splice(index, 1)

        if (listeners.length === 0) {
          Reflect.deleteProperty(this._listeners, type)
        }
      }
    }
  }
  
  /**
   * 添加事件监听,需要指定事件标示和处理方法
   *
   * @example
   *    map.addEventListener('singleclick', function(event) {})
   *
   * @method addEventListener
   * @param type {String} event type
   * @param listener {Array} listeners for event type
   */
  addEventListener (type, listener) {
    let listeners = this._listeners[type]
    if (!listeners) {
      listeners = this._listeners[type] = []
    }

    if (listeners.indexOf(listener) === -1) {
      listeners.push(listener)
    }
  }
  
  /**
   * 事件派发
   *
   * @example
   * this.dispatchEvent(EventType.CHANGE)
   *
   * @method dispatchEvent
   * @param event {String} event type string
   * @returns {Boolean} ture if success ,false otherwise.
   */
  dispatchEvent (event) {
    const evt = typeof event === 'string' ? {type: event} : event
    const type = evt.type
    evt.target = this
    const listeners = this._listeners[type]
    let propagate

    if (listeners) {
      if(!Reflect.has(this._dispatching, type)) {
        this._dispatching[type] = 0
        this._pendingRemovals[type] = 0
      }

      ++this._dispatching[type]

      for (let i = 0, ii = listeners.length; i < ii; ++i) {
        if (listeners[i].call(this, evt) === false || evt.propagationStopped) {
          propagate = false
          break
        }
      }

      --this._dispatching[type]

      if (this._dispatching[type] === 0) {
        let pendingRemovals = this._pendingRemovals[type]
        Reflect.deleteProperty(this._pendingRemovals, type)

        while (pendingRemovals--) {
          this.removeEventListener(type, this.nullFunction)
        }

        Reflect.deleteProperty(this._dispatching, type)
      }

      return propagate
    }
  }
}
