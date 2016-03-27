///<reference path="jquery.d.ts"/>
/**
 * Scripts file containing functions related to modal windows
 *
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @author Christoph Ulshoefer <christophsulshoefer@gmail.com>
 * @copyright 2016
 * @license http://opensource.org/licenses/mit-license.php MIT License
 * @version 0.1.8
 */

/**
 * Constant specifying a delay before the AJAX request after the user
 * has finished typing
 * @since 0.1.4
 */
const AJAX_DELAY: number = 600;
const FIELD_GIVEN_NAME: number = -1;
const FIELD_MIDDLE_NAME: number = -2;
const FIELD_LAST_NAME: number = -3;
const FIELD_RECORD_NAME: number = 1;
const FIELD_START_DATE: number = 2;
const FIELD_END_DATE: number = 3;
const FIELD_EMAIL: number = 4;
const FIELD_PHONE: number = 5;
const FIELD_ADDRESS: number = 6;

/**
 * Default error interface
 * @since 0.0.3
 */
interface Error {
    id:number,
    description:string
}
/**
 * Interface indicating that the object has a render() function,
 * i.e. can be rendered on a page
 * @since 0.1.4
 */
interface Renderable {
    render(target:JQuery);
}
/**
 * Interface specifying an object containing HTML attributes for a tag
 * @since 0.1.4
 */
interface Attributes {
    [key:string]:string;
}

/**
 * Util class
 * @since 0.0.4
 */
class Util {

    /**
     * Returns the full URL to resource
     *
     * @returns {string}
     * @since 0.0.4
     */
    public static url(url:string, trailingSlash:boolean = true):string {
        if (url.substr(0, 1) != '/') {
            url = '/' + url;
        }
        if (trailingSlash && url.substr(url.length - 1) != '/') {
            url += '/';
        }
        return url;
    }

    /**
     * Sends the user to specified URL
     *
     * @param url
     * @param trailingSlash
     * @since 0.1.0
     */
    public static to(url:string, trailingSlash:boolean = true) {
        location.href = Util.url(url, trailingSlash);
    }

    /**
     * Displays the error modal window
     *
     * @param message
     * @since 0.0.4
     */
    public static error(message:string = 'An error has occurred.') {
        var modal = $('#error-modal');
        var messageContainer = $('#error-message');
        modal.on('show.bs.modal', function () {
            messageContainer.html(message);
        });
        modal.modal('show');
    }

    /**
     * Converts MySQL date time string into JS' Date object
     *
     * @param sqlDate
     * @returns {Date}
     * @since 0.0.6
     */
    public static parseSQLDate(sqlDate:string):Date {
        var parts = sqlDate.split(/[- :]/);
        return new Date(+parts[0], +parts[1] - 1, +parts[2], +parts[3], +parts[4], +parts[5]);
    }

    /**
     * Creates a MySQL date string based on JS Date object
     *
     * @param date
     * @returns {string}
     * @since 0.1.2
     */
    public static toMysqlFormat(date:Date):string {
        return date.getUTCFullYear() + "-" + Util.twoDigits(1 + date.getUTCMonth()) + "-" + Util.twoDigits(date.getUTCDate()) + " " + Util.twoDigits(date.getUTCHours()) + ":" + Util.twoDigits(date.getUTCMinutes()) + ":" + Util.twoDigits(date.getUTCSeconds());
    };

    /**
     * Required for the function above
     *
     * @param d
     * @returns {string}
     * @since 0.1.2
     */
    public static twoDigits(d:any):string {
        if (0 <= d && d < 10) return "0" + d.toString();
        if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
        return d.toString();
    }

    /**
     * Formats JS Date to the following format:
     * January 1st, 1970
     *
     * @param date
     * @returns {string}
     * @since 0.0.7
     */
    public static formatDate(date:Date):string {
        var months = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];
        var day = date.getDate().toString().slice(-1);
        var daySuffix = 'th';
        if (day == '1') daySuffix = 'st';
        if (day == '2') daySuffix = 'nd';
        if (day == '3') daySuffix = 'rd';
        return months[date.getMonth()] + ' ' + date.getDate() + daySuffix + ', ' + date.getFullYear();
    }

    /**
     * Formats JS Date to the following format:
     * January 1st, 1970
     *
     * @param date
     * @returns {string}
     * @since 0.1.1
     */
    public static formatShortDate(date:Date):string {
        var months = [
            "Jan", "Feb", "Mar",
            "Apr", "May", "Jun", "Jul",
            "Aug", "Sep", "Oct",
            "Nov", "Dec"
        ];
        return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
    }

    /**
     *
     * @param date
     * @return {string}
     * @since 0.1.6
     */
    public static formatNumberDate(date:Date):string {
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    }

    /**
     * Gets a date picker with specified value and div id
     *
     * @param date
     * @param divid
     * @returns {JQuery}
     * @since 0.1.5
     */
    public static getDatePicker(date:string, divid:string):JQuery {
        var inputField = $('<input id="' + divid + '" type="text" value="' + date + '" class="form-control input-sm input-block-level">');
        var container = $('<div class="input-group date" data-provide="datepicker"></div>');
        var content = $('<span class="input-group-addon" style="padding: 0 18px !important; font-size: 0.8em !important;"><i class="glyphicon glyphicon-th"></i></span>');
        var assembled = container.append(inputField);
        assembled.append(content);
        return container;
    }

    /**
     * Extracts the ID (of a record) from the URL, i.e.
     * ../record/view/201/ -> 201
     *
     * @param url
     * @returns {number}
     * @since 0.1.3
     */
    public static extractId(url:string):number {
        var re = new RegExp("[^\/]+(?=\/*$)|$");
        var base = re.exec(url);
        if (base == null) return NaN;
        return parseInt(base[0]);
    }

    /**
     * Builds a JQuery node
     *
     * @param tag
     * @param attributes
     * @param content
     * @param selfClosing
     * @returns {JQuery}
     * @since 0.1.4
     */
    public static buildNode(tag:string, attributes:Attributes = {}, content:string = '', selfClosing:boolean = false):JQuery {
        var attributesString = '';
        for (var key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                attributesString += ' ' + key + '="' + attributes[key].replace('"', '\\"') + '"';
            }
        }
        return $('<' + tag + attributesString + (selfClosing ? ' />' : '>' + content + '</' + tag + '>'));
    }

    /**
     * Merges two objects into one
     *
     * @param object1
     * @param object2
     * @returns {{}}
     * @since 0.1.4
     */
    public static mergeObjects(object1:Object, object2:Object):Object {
        var object = {};
        for (var key in object1) {
            if (object1.hasOwnProperty(key)) {
                object[key] = object1[key];
            }
        }
        for (var key in object2) {
            if (object2.hasOwnProperty(key)) {
                object[key] = object2[key];
            }
        }
        return object;
    }

    /**
     * Determines whether the supplied object is a string
     *
     * @param object
     * @returns {boolean}
     * @since 0.1.8
     */
    public static isString(object:any):boolean {
        return typeof object === 'string' || object instanceof String;
    }
}

/**
 * Deals with loaders
 * @since 0.0.9 Added documentation
 * @since 0.0.5
 */
class LoaderManager {

    private static loaders:{[id:number]:JQuery} = {};
    private static counter = 0;

    /**
     * Returns the unique ID of the loader after placing it on the page as the first child of the target
     * container. The loader is initially hidden.
     *
     * @param target
     * @returns {number}
     * @since 0.0.5
     */
    public static createLoader(target:JQuery):number {
        var loader = $('<div class="loader"></div>');
        for (var i = 0; i < 5; i++) {
            loader.append($('<div class="line-' + (i + 1) + '"></div>'));
        }
        var id = LoaderManager.newId();
        var container = $('<div class="loader-container loader-' + id + '" style="display: none">');
        container.append(loader);
        this.loaders[id] = container;
        target.prepend(container);
        return id;
    }

    /**
     * Fades in the loader, callback is called after the animation is complete
     *
     * @param id
     * @param callback
     * @since 0.0.5
     */
    public static showLoader(id:number, callback:Function = null) {
        if (callback == null) {
            this.loaders[id].fadeIn(200);
        } else {
            this.loaders[id].fadeIn(200, callback);
        }
    }

    /**
     * Fades out the loader, callback is called after the animation is complete
     *
     * @param id
     * @param callback
     * @since 0.0.5
     */
    public static hideLoader(id:number, callback:Function = null) {
        if (callback == null) {
            this.loaders[id].fadeOut(200);
        } else {
            this.loaders[id].fadeOut(200, callback);
        }
    }

    /**
     * Removes the loader from the page based on its ID
     *
     * @param id
     */
    public static destroyLoader(id:number) {
        this.loaders[id].remove();
        delete this.loaders[id];
    }

    private static newId():number {
        return ++this.counter;
    }

}

/**
 * Sets the base url
 * @since 0.0.1
 */
if (!location.origin) {
    location.origin = location.protocol + "//" + location.host;
}