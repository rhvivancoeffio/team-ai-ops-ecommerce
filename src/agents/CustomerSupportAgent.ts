import { BaseAgent } from '../core/BaseAgent';
import { Task, AgentConfig } from '../types';

/**
 * Customer Support Agent - handles customer inquiries and support tickets
 */
export class CustomerSupportAgent extends BaseAgent {
  constructor(config: AgentConfig) {
    super(config);
  }

  protected async executeTask(task: Task): Promise<any> {
    const { type, data } = task;

    switch (type) {
      case 'customer-support':
        return await this.handleSupportTicket(data);
      case 'sentiment-analysis':
        return await this.analyzeSentiment(data);
      case 'generate-response':
        return await this.generateResponse(data);
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
  }

  /**
   * Handle a support ticket
   */
  private async handleSupportTicket(data: any): Promise<any> {
    const { ticketId, customerId, message, priority } = data;

    // Analyze sentiment
    const sentiment = await this.analyzeSentiment({ message });

    // Generate appropriate response
    const response = await this.generateResponse({
      message,
      sentiment: sentiment.sentiment,
      priority
    });

    return {
      ticketId,
      customerId,
      sentiment: sentiment.sentiment,
      confidence: sentiment.confidence,
      suggestedResponse: response.message,
      escalate: sentiment.sentiment === 'negative' && sentiment.confidence > 0.8,
      category: this.categorizeTicket(message),
      timestamp: new Date()
    };
  }

  /**
   * Analyze sentiment of customer message
   */
  private async analyzeSentiment(data: any): Promise<any> {
    const { message } = data;

    // Simple sentiment analysis (in production, use ML model)
    const positiveWords = ['great', 'excellent', 'happy', 'love', 'amazing', 'wonderful', 'fantastic'];
    const negativeWords = ['bad', 'terrible', 'angry', 'hate', 'disappointed', 'awful', 'horrible'];

    const lowerMessage = message.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach(word => {
      if (lowerMessage.includes(word)) positiveCount++;
    });

    negativeWords.forEach(word => {
      if (lowerMessage.includes(word)) negativeCount++;
    });

    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    let confidence = 0.5;

    if (positiveCount > negativeCount) {
      sentiment = 'positive';
      confidence = Math.min(0.5 + (positiveCount * 0.1), 1.0);
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
      confidence = Math.min(0.5 + (negativeCount * 0.1), 1.0);
    }

    return { sentiment, confidence, positiveCount, negativeCount };
  }

  /**
   * Generate response based on context
   */
  private async generateResponse(data: any): Promise<any> {
    const { message, sentiment, priority } = data;

    let responseMessage = '';

    if (sentiment === 'negative') {
      responseMessage = 'We sincerely apologize for the inconvenience you\'ve experienced. ' +
        'We take your concerns very seriously and want to make this right. ' +
        'A senior support specialist will reach out to you within 2 hours to resolve this issue.';
    } else if (sentiment === 'positive') {
      responseMessage = 'Thank you so much for your kind words! We\'re thrilled to hear you\'re having ' +
        'a great experience. If you need any assistance, we\'re always here to help.';
    } else {
      responseMessage = 'Thank you for contacting us. We\'ve received your message and our team ' +
        'is reviewing it. We\'ll get back to you within 24 hours with a detailed response.';
    }

    return {
      message: responseMessage,
      priority: sentiment === 'negative' ? 'high' : priority || 'normal',
      suggestedActions: this.getSuggestedActions(message, sentiment)
    };
  }

  /**
   * Categorize ticket based on content
   */
  private categorizeTicket(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('refund') || lowerMessage.includes('return')) {
      return 'refund-return';
    } else if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
      return 'shipping';
    } else if (lowerMessage.includes('product') || lowerMessage.includes('quality')) {
      return 'product-quality';
    } else if (lowerMessage.includes('account') || lowerMessage.includes('login')) {
      return 'account';
    } else if (lowerMessage.includes('payment') || lowerMessage.includes('charge')) {
      return 'payment';
    }

    return 'general';
  }

  /**
   * Get suggested actions based on message and sentiment
   */
  private getSuggestedActions(message: string, sentiment: string): string[] {
    const actions: string[] = [];

    if (sentiment === 'negative') {
      actions.push('escalate-to-senior-support');
      actions.push('offer-compensation');
    }

    const category = this.categorizeTicket(message);
    switch (category) {
      case 'refund-return':
        actions.push('check-refund-policy', 'initiate-return-process');
        break;
      case 'shipping':
        actions.push('track-shipment', 'contact-carrier');
        break;
      case 'product-quality':
        actions.push('request-photos', 'arrange-replacement');
        break;
    }

    return actions;
  }
}
