import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Brain, 
  Zap, 
  Settings, 
  Users, 
  ChevronRight, 
  Play, 
  CheckCircle,
  ArrowRight,
  Target,
  BookOpen,
  MessageSquare,
  BarChart3,
  Loader2,
  Download,
  Copy,
  RefreshCw
} from 'lucide-react';

const ImprovedLandingPage = () => {
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedConversation, setGeneratedConversation] = useState(null);
  const [formData, setFormData] = useState({
    generationMode: 'single_ai',
    subject: 'mathematics',
    conversationLength: 8,
    temperature: 0.8,
    maxTokens: 2000,
    conversationStarter: 'tutor',
    customTopic: ''
  });

  // Preset configurations focused on single and dual AI modes
  const presets = [
    {
      id: 'basic_math_single',
      name: "Basic Math Tutoring",
      description: "Simple algebra tutoring with single AI model",
      complexity: "Beginner",
      subject: "Mathematics",
      mode: "single_ai",
      featured: false,
      config: {
        generationMode: 'single_ai',
        subject: 'mathematics',
        ai_settings: {
          model: 'gpt-4o',
          temperature: 0.8,
          max_tokens: 1500
        },
        conversation_structure: {
          turns: { mean: 6, std: 1, min: 4, max: 8 },
          conversation_starter: 'tutor'
        },
        educational_objectives: {
          subject: 'mathematics',
          topic: 'basic algebra'
        }
      }
    },
    {
      id: 'science_dual',
      name: "Science Discovery Learning",
      description: "Dual AI system for scientific method exploration",
      complexity: "Intermediate",
      subject: "Science",
      mode: "dual_ai",
      featured: true,
      config: {
        generationMode: 'dual_ai',
        subject: 'science',
        models: {
          tutor: {
            model: 'gpt-4o',
            temperature: 0.7,
            max_tokens: 1200
          },
          student: {
            model: 'gpt-4o',
            temperature: 0.9,
            max_tokens: 800
          }
        },
        conversation_structure: {
          turns: { mean: 10, std: 2, min: 8, max: 12 },
          conversation_starter: 'student'
        },
        student_purposes: {
          purpose_weights: {
            better_understanding: 0.4,
            clarification: 0.3,
            practice: 0.3
          }
        },
        tutor_purposes: {
          purpose_weights: {
            scaffolding: 0.3,
            explanation: 0.4,
            guided_discovery: 0.3
          }
        }
      }
    },
    {
      id: 'advanced_math_dual',
      name: "Advanced Math Collaboration",
      description: "Dual AI for complex mathematical problem solving",
      complexity: "Advanced",
      subject: "Mathematics",
      mode: "dual_ai",
      featured: true,
      config: {
        generationMode: 'dual_ai',
        subject: 'mathematics',
        models: {
          tutor: {
            model: 'o3-mini',
            max_tokens: 1000,
            reasoning_effort: 'medium'
          },
          student: {
            model: 'gpt-4o',
            temperature: 0.8,
            max_tokens: 600
          }
        },
        conversation_structure: {
          turns: { mean: 8, std: 1, min: 6, max: 10 },
          conversation_starter: 'tutor'
        },
        educational_objectives: {
          subject: 'mathematics',
          topic: 'calculus and derivatives'
        }
      }
    },
    {
      id: 'language_single',
      name: "Language Arts Tutoring",
      description: "Single AI for grammar and writing instruction",
      complexity: "Beginner",
      subject: "Language Arts",
      mode: "single_ai",
      featured: false,
      config: {
        generationMode: 'single_ai',
        subject: 'language',
        ai_settings: {
          model: 'gpt-4o',
          temperature: 0.7,
          max_tokens: 1800
        },
        conversation_structure: {
          turns: { mean: 7, std: 1, min: 5, max: 9 },
          conversation_starter: 'student'
        },
        educational_objectives: {
          subject: 'language',
          topic: 'grammar and sentence structure'
        }
      }
    },
    {
      id: 'history_dual',
      name: "Historical Analysis",
      description: "Dual AI for exploring historical events and contexts",
      complexity: "Intermediate",
      subject: "History",
      mode: "dual_ai",
      featured: false,
      config: {
        generationMode: 'dual_ai',
        subject: 'history',
        conversation_structure: {
          turns: { mean: 9, std: 2, min: 7, max: 11 },
          conversation_starter: 'tutor'
        },
        student_purposes: {
          purpose_weights: {
            better_understanding: 0.5,
            clarification: 0.3,
            validation: 0.2
          }
        },
        tutor_purposes: {
          purpose_weights: {
            explanation: 0.4,
            assessment: 0.3,
            guided_discovery: 0.3
          }
        }
      }
    },
    {
      id: 'custom_single',
      name: "Custom Topic - Single AI",
      description: "Flexible single AI configuration for any subject",
      complexity: "Customizable",
      subject: "Custom",
      mode: "single_ai",
      featured: false,
      config: {
        generationMode: 'single_ai',
        subject: 'custom',
        ai_settings: {
          model: 'gpt-4o',
          temperature: 0.8,
          max_tokens: 2000
        },
        conversation_structure: {
          turns: { mean: 8, std: 2, min: 6, max: 10 },
          conversation_starter: 'tutor'
        }
      }
    }
  ];

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset);
    setFormData({
      ...preset.config,
      customTopic: preset.config.educational_objectives?.topic || ''
    });
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      setGeneratedConversation(result);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">ChatSynth</h1>
                <p className="text-xs text-slate-600">Educational Conversation Generator</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">Documentation</Button>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                API Access
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="space-y-4 mb-8">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
              <Zap className="w-4 h-4 mr-1" />
              AI-Powered Education
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Generate Educational
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Conversations </span>
              with AI
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Create realistic, engaging educational conversations using advanced AI models. 
              Choose between single AI or dual AI modes for different learning scenarios.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Play className="w-5 h-5 mr-2" />
              Start Generating
            </Button>
            <Button size="lg" variant="outline">
              View Examples
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-slate-600">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Single & Dual AI Modes</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Multiple Subjects</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Customizable Parameters</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Preset Cards Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  <span>Choose a Preset Configuration</span>
                </CardTitle>
                <CardDescription>
                  Select from pre-configured setups optimized for different educational scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {presets.map((preset) => (
                    <Card 
                      key={preset.id} 
                      className={`group cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                        selectedPreset?.id === preset.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-slate-200 hover:border-blue-200'
                      }`}
                      onClick={() => handlePresetSelect(preset)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base group-hover:text-blue-600 transition-colors flex items-center">
                              {preset.name}
                              {preset.featured && (
                                <Badge className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs">
                                  Popular
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="mt-1 text-sm">
                              {preset.description}
                            </CardDescription>
                          </div>
                          <ChevronRight className={`w-4 h-4 transition-all duration-300 ${
                            selectedPreset?.id === preset.id 
                              ? 'text-blue-500 rotate-90' 
                              : 'text-slate-400 group-hover:text-blue-500'
                          }`} />
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Mode:</span>
                            <Badge variant={preset.mode === 'dual_ai' ? 'default' : 'secondary'} className="text-xs">
                              {preset.mode === 'dual_ai' ? 'Dual AI' : 'Single AI'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Subject:</span>
                            <Badge variant="outline" className="text-xs">{preset.subject}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Complexity:</span>
                            <Badge 
                              variant={
                                preset.complexity === 'Advanced' ? 'destructive' : 
                                preset.complexity === 'Intermediate' ? 'default' : 'secondary'
                              }
                              className="text-xs"
                            >
                              {preset.complexity}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Configuration Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-purple-500" />
                  <span>Configuration</span>
                </CardTitle>
                <CardDescription>
                  Customize your conversation generation settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Generation Mode */}
                <div className="space-y-2">
                  <Label htmlFor="mode">Generation Mode</Label>
                  <Select 
                    value={formData.generationMode} 
                    onValueChange={(value) => handleFormChange('generationMode', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single_ai">
                        <div className="flex items-center space-x-2">
                          <Brain className="w-4 h-4" />
                          <span>Single AI</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="dual_ai">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>Dual AI</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select 
                    value={formData.subject} 
                    onValueChange={(value) => handleFormChange('subject', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="language">Language Arts</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom Topic */}
                {formData.subject === 'custom' && (
                  <div className="space-y-2">
                    <Label htmlFor="topic">Custom Topic</Label>
                    <Input
                      id="topic"
                      placeholder="Enter your topic..."
                      value={formData.customTopic}
                      onChange={(e) => handleFormChange('customTopic', e.target.value)}
                    />
                  </div>
                )}

                {/* Conversation Length */}
                <div className="space-y-3">
                  <Label>Conversation Length: {formData.conversationLength} turns</Label>
                  <Slider
                    value={[formData.conversationLength]}
                    onValueChange={(value) => handleFormChange('conversationLength', value[0])}
                    max={15}
                    min={4}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>4 turns</span>
                    <span>15 turns</span>
                  </div>
                </div>

                {/* Conversation Starter */}
                <div className="space-y-2">
                  <Label htmlFor="starter">Conversation Starter</Label>
                  <Select 
                    value={formData.conversationStarter} 
                    onValueChange={(value) => handleFormChange('conversationStarter', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Who starts?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tutor">Tutor</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="random">Random</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Advanced Settings for Single AI */}
                {formData.generationMode === 'single_ai' && (
                  <>
                    <div className="space-y-3">
                      <Label>Temperature: {formData.temperature}</Label>
                      <Slider
                        value={[formData.temperature]}
                        onValueChange={(value) => handleFormChange('temperature', value[0])}
                        max={1}
                        min={0}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Focused</span>
                        <span>Creative</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Max Tokens: {formData.maxTokens}</Label>
                      <Slider
                        value={[formData.maxTokens]}
                        onValueChange={(value) => handleFormChange('maxTokens', value[0])}
                        max={3000}
                        min={500}
                        step={100}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>500</span>
                        <span>3000</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Generate Button */}
                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Generate Conversation
                    </>
                  )}
                </Button>

                {/* Quick Actions */}
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Mode Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  {formData.generationMode === 'dual_ai' ? 'Dual AI Mode' : 'Single AI Mode'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-slate-600 space-y-2">
                  {formData.generationMode === 'dual_ai' ? (
                    <>
                      <p>Uses separate AI models for tutor and student roles, creating more realistic interactions through turn-by-turn generation.</p>
                      <div className="flex items-center space-x-2 text-xs">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span>Async processing with progress tracking</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span>Individual AI personalities</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <p>Uses a single AI model to generate the entire conversation in one request. Faster and more cost-effective.</p>
                      <div className="flex items-center space-x-2 text-xs">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span>Quick generation (10-30 seconds)</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span>Consistent conversation flow</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Results Section */}
        {generatedConversation && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-green-500" />
                  <span>Generated Conversation</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(JSON.stringify(generatedConversation, null, 2))}>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy JSON
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Your AI-generated educational conversation is ready
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generatedConversation.conversation?.map((turn, index) => (
                  <div key={index} className={`p-4 rounded-lg ${
                    turn.role === 'tutor' 
                      ? 'bg-blue-50 border-l-4 border-blue-400' 
                      : 'bg-green-50 border-l-4 border-green-400'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant={turn.role === 'tutor' ? 'default' : 'secondary'}>
                        {turn.role === 'tutor' ? 'Tutor' : 'Student'}
                      </Badge>
                      <span className="text-xs text-slate-500">Turn {index + 1}</span>
                    </div>
                    <p className="text-slate-700">{turn.message}</p>
                  </div>
                ))}
              </div>
              
              {generatedConversation.metadata && (
                <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-2">Conversation Metadata</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Total Turns:</span>
                      <div className="font-medium">{generatedConversation.metadata.total_turns}</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Subject:</span>
                      <div className="font-medium capitalize">{generatedConversation.metadata.subject}</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Model:</span>
                      <div className="font-medium">{generatedConversation.metadata.model_used}</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Mode:</span>
                      <div className="font-medium">{generatedConversation.metadata.generation_mode}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Features Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose ChatSynth?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Advanced AI technology meets educational expertise to create the most realistic conversations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Advanced AI Models",
                description: "Powered by GPT-4o and O3-mini for high-quality, contextually aware conversations"
              },
              {
                icon: Users,
                title: "Dual AI Architecture",
                description: "Separate AI agents for tutor and student roles create authentic interactions"
              },
              {
                icon: Target,
                title: "Educational Focus",
                description: "Purpose-built for educational scenarios with learning objectives in mind"
              },
              {
                icon: Settings,
                title: "Highly Customizable",
                description: "Fine-tune every aspect from conversation length to AI personality traits"
              },
              {
                icon: BarChart3,
                title: "Real-time Progress",
                description: "Track generation progress with detailed status updates and metadata"
              },
              {
                icon: BookOpen,
                title: "Multiple Subjects",
                description: "Pre-configured for mathematics, science, language arts, history, and custom topics"
              }
            ].map((feature, index) => (
              <div key={index} className="group p-6 rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 mt-2 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImprovedLandingPage;
