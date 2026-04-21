export function getDecisionLabel(decision, language) {
  if (language !== "zh") {
    if (decision === "go_for_it") {
      return "go for it";
    }

    if (decision === "not_now") {
      return "not now";
    }

    return decision;
  }

  if (decision === "go_for_it") {
    return "\u53bb\u505a\u5427";
  }

  if (decision === "not_now") {
    return "\u8fd8\u4e0d\u662f\u65f6\u5019";
  }

  return decision;
}

export function getMessageLabel(message, language) {
  if (language !== "zh") {
    return message;
  }

  if (message === "Current weighted score supports taking action now.") {
    return "\u5f53\u524d\u52a0\u6743\u5206\u6570\u652f\u6301\u4f60\u73b0\u5728\u91c7\u53d6\u884c\u52a8\u3002";
  }

  if (
    message === "Current weighted score suggests waiting for a better timing."
  ) {
    return "\u5f53\u524d\u52a0\u6743\u5206\u6570\u5efa\u8bae\u4f60\u7b49\u5f85\u66f4\u5408\u9002\u7684\u65f6\u673a\u3002";
  }

  return message;
}
