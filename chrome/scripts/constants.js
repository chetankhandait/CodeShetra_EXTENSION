/**
 * @constant
 * @type {{runtime: object, i18n: object}} BrowserAPI
 */
const brw = chrome;

/**
 * @constant
 * @type {{
 *  patterns: Array.<{
 *      name: string,
 *      className: string,
 *      detectionFunctions: Array.<Function>,
 *      infoUrl: string,
 *      info: string,
 *      languages: Array.<string>
 *  }>
 * }}
 */
export const patternConfig = {
  patterns: [
    //    countdoun --------------------------------------------------------------------------------------
    {
      /**
       */
      name: brw.i18n.getMessage("patternCountdown_name"),
      className: "countdown",
      detectionFunctions: [
        function (node, nodeOld) {
          if (nodeOld && node.innerText != nodeOld.innerText) {
            /**
             * @constant
             */
            const reg =
              /(?:\d{1,2}\s*:\s*){1,3}\d{1,2}|(?:\d{1,2}\s*(?:days?|hours?|minutes?|seconds?|tage?|stunden?|minuten?|sekunden?|[a-zA-Z]{1,3}\.?)(?:\s*und)?\s*){2,4}/gi;

            /**
             * @constant
             */
            const regBad =
              /(?:\d{1,2}\s*:\s*){4,}\d{1,2}|(?:\d{1,2}\s*(?:days?|hours?|minutes?|seconds?|tage?|stunden?|minuten?|sekunden?|[a-zA-Z]{1,3}\.?)(?:\s*und)?\s*){5,}/gi;

            let matchesOld = nodeOld.innerText.replace(regBad, "").match(reg);
            let matchesNew = node.innerText.replace(regBad, "").match(reg);

            if (
              matchesNew == null ||
              matchesOld == null ||
              (matchesNew != null &&
                matchesOld != null &&
                matchesNew.length != matchesOld.length)
            ) {
              return false;
            }

            for (let i = 0; i < matchesNew.length; i++) {
              let numbersNew = matchesNew[i].match(/\d+/gi);
              let numbersOld = matchesOld[i].match(/\d+/gi);

              if (numbersNew.length != numbersOld.length) {
                continue;
              }

              for (let x = 0; x < numbersNew.length; x++) {
                
                if (parseInt(numbersNew[x]) > parseInt(numbersOld[x])) {
                  break;
                }
                if (parseInt(numbersNew[x]) < parseInt(numbersOld[x])) {
                  return true;
                }
              }
            }
          }
          return false;
        },
      ],
      infoUrl: brw.i18n.getMessage("patternCountdown_infoUrl"),
      info: brw.i18n.getMessage("patternCountdown_info"),
      languages: ["en", "de"],
    },

    // ------------------------scarcity-----------------------------------------------

    {
      name: brw.i18n.getMessage("patternBaitAndSwitch_name"),
      className: "bait-and-switch",
      detectionFunctions: [
        function (node, nodeOld) {
          return /limited/i.test(node.innerText);
        },
      ],
      infoUrl: brw.i18n.getMessage("patternBaitAndSwitch_infoUrl"),
      info: brw.i18n.getMessage("patternBaitAndSwitch_info"),
      languages: ["en", "de"],
    },

    {
      name: brw.i18n.getMessage("patternFalseUrgency_name"),
      className: "false-urgency",
      detectionFunctions: [
        function (node, nodeOld) {
          return (
            /urgent/i.test(node.innerText) && /false/i.test(node.innerText)
          );
        },
        function (node, nodeOld) {
          return /deal\s*of\s*the\s*day/i.test(node.innerText);
        },
        function (node, nodeOld) {
          return /only\s*left\s*in\s*stock/i.test(node.innerText);
        },
        function (node, nodeOld) {
          return /Activate\s*coupon/i.test(node.innerText);
        },
        function (node, nodeOld) {
          return /only \s*/i.test(node.innerText);
        },
      ],
      infoUrl: brw.i18n.getMessage("patternFalseUrgency_infoUrl"),
      info: brw.i18n.getMessage("patternFalseUrgency_info"),
      languages: ["en", "de"],
    },

    {
      name: brw.i18n.getMessage("patternSubscriptionTrap_name"),
      className: "subscription-trap",
      detectionFunctions: [
        function (node, nodeOld) {
          return /Get\s*Premium\s*free/i.test(node.innerText);
        },
        function (node, nodeOld) {
          return /v\s*i\s*p/i.test(node.innerText);
        },
      ],
      infoUrl: brw.i18n.getMessage("patternSubscriptionTrap_infoUrl"),
      info: brw.i18n.getMessage("patternSubscriptionTrap_info"),
      languages: ["en", "de"],
    },

    {
        name: brw.i18n.getMessage("patternDisguisedAd_name"),
        className: "disguised-ad",
        detectionFunctions: [
            function (node, nodeOld) {
                return /ads\s*/i.test(node.innerText);
              },
              function (node, nodeOld) {
                return /Sponsored/i.test(node.innerText);
              },
        ],
        infoUrl: brw.i18n.getMessage("patternDisguisedAd_infoUrl"),
        info: brw.i18n.getMessage("patternDisguisedAd_info"),
        languages: [
            "en",
            "de"
        ]
    },
    {
      /**
       */
      name: brw.i18n.getMessage("patternForcedContinuity_name"),
      className: "forced-continuity",
      detectionFunctions: [
        function (node, nodeOld) {
          if (
            /(?:(?:€|₹|GBP|£|\$|USD)\s*\d+(?:\.\d{2})?|\d+(?:\.\d{2})?\s*(?:euros?|€|₹|GBP|£|pounds?(?:\s*sterling)?|\$|USD|dollars?))\s*(?:(?:(?:per|\/|a)\s*month)|(?:p|\/)m)\s*(?:after|from\s*(?:month|day)\s*\d+)/i.test(
              node.innerText
            )
          ) {
            return true;
          }
          if (
            /(?:(?:€|₹|GBP|£|\$|USD)\s*\d+(?:\.\d{2})?|\d+(?:\.\d{2})?\s*(?:euros?|€|₹|GBP|£|pounds?(?:\s*sterling)?|\$|USD|dollars?))\s*(?:after\s*(?:the)?\s*\d+(?:th|nd|rd|th)?\s*(?:months?|days?)|from\s*(?:month|day)\s*\d+)/i.test(
              node.innerText
            )
          ) {
            return true;
          }
          if (
            /(?:after\s*that|then|afterwards|subsequently)\s*(?:(?:€|₹|GBP|£|\$|USD)\s*\d+(?:\.\d{2})?|\d+(?:\.\d{2})?\s*(?:euros?|€|₹|GBP|£|pounds?(?:\s*sterling)?|\$|USD|dollars?))\s*(?:(?:(?:per|\/|a)\s*month)|(?:p|\/)m)/i.test(
              node.innerText
            )
          ) {
            return true;
          }
          if (
            /after\s*(?:the)?\s*\d+(?:th|nd|rd|th)?\s*months?\s*(?:only|just)?\s*(?:(?:€|₹|GBP|£|\$|USD)\s*\d+(?:\.\d{2})?|\d+(?:\.\d{2})?\s*(?:euros?|€|₹|GBP|£|pounds?(?:\s*sterling)?|\$|USD|dollars?))/i.test(
              node.innerText
            )
          ) {
            return true;
          }
          return false;
        },
        function (node, nodeOld) {
          if (
            /\d+(?:,\d{2})?\s*(?:Euro|€)\s*(?:(?:pro|im|\/)\s*Monat)?\s*(?:ab\s*(?:dem)?\s*\d+\.\s*Monat|nach\s*\d+\s*(?:Monaten|Tagen)|nach\s*(?:einem|1)\s*Monat)/i.test(
              node.innerText
            )
          ) {
            return true;
          }
          if (
            /(?:anschließend|danach)\s*\d+(?:,\d{2})?\s*(?:Euro|€)\s*(?:pro|im|\/)\s*Monat/i.test(
              node.innerText
            )
          ) {
            return true;
          }
          if (
            /\d+(?:,\d{2})?\s*(?:Euro|€)\s*(?:pro|im|\/)\s*Monat\s*(?:anschließend|danach)/i.test(
              node.innerText
            )
          ) {
            return true;
          }
          if (
            /ab(?:\s*dem)?\s*\d+\.\s*Monat(?:\s*nur)?\s*\d+(?:,\d{2})?\s*(?:Euro|€)/i.test(
              node.innerText
            )
          ) {
            return true;
          }
          return false;
        },
      ],
      infoUrl: brw.i18n.getMessage("patternForcedContinuity_infoUrl"),
      info: brw.i18n.getMessage("patternForcedContinuity_info"),
      languages: ["en", "de"],
    },
  ],
};

/**
 * @returns {boolean} `true` if the `patternConfig` is valid, `false` otherwise.
 */
function validatePatternConfig() {
  let names = patternConfig.patterns.map((p) => p.name);
  // Check if there are duplicate names.
  if (new Set(names).size !== names.length) {
    return false;
  }
  for (let pattern of patternConfig.patterns) {
    // Ensure that the name is a non-empty string.
    if (!pattern.name || typeof pattern.name !== "string") {
      return false;
    }
    if (!pattern.className || typeof pattern.className !== "string") {
      return false;
    }
    if (
      !Array.isArray(pattern.detectionFunctions) ||
      pattern.detectionFunctions.length <= 0
    ) {
      return false;
    }
    for (let detectionFunc of pattern.detectionFunctions) {
      if (typeof detectionFunc !== "function" || detectionFunc.length !== 2) {
        return false;
      }
    }
    if (!pattern.infoUrl || typeof pattern.infoUrl !== "string") {
      return false;
    }
    if (!pattern.info || typeof pattern.info !== "string") {
      return false;
    }
    if (!Array.isArray(pattern.languages) || pattern.languages.length <= 0) {
      return false;
    }
    for (let language of pattern.languages) {
      if (!language || typeof language !== "string") {
        return false;
      }
    }
  }
  return true;
}

/**
 */
export const patternConfigIsValid = validatePatternConfig();

/**
 * @constant
 */
export const extensionClassPrefix = "d_";

/**
 * @constant
 */
export const patternDetectedClassName =
  extensionClassPrefix + "pattern-detected";

/**
 */
export const currentPatternClassName = extensionClassPrefix + "current-pattern";

/**
 */
export const tagBlacklist = ["script", "style", "noscript", "audio", "video"];
