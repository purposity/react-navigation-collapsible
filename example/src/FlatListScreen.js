import React, {Component} from 'react';
import { Text, FlatList, View, Animated, TouchableOpacity } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';

import { CollapsibleHeaderBackView, makeCollapsibleParams, withCollapsibleOptions, defaultHeaderHeight } from 'react-navigation-collapsible';

const headerHeight = defaultHeaderHeight;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default class FlatListScreen extends Component{
  static navigationOptions = ({navigationOptions, navigation}) => {
    console.log('A');
    return withCollapsibleOptions(
      navigationOptions, 
      {
        title: 'Second Screen',
        headerStyle: { backgroundColor: 'red' }
      },
      navigation.state.params
    );
  }

  constructor(props){
    super(props);

    const data = [];
    for(let i = 0 ; i < 60 ; i++){
      data.push(i);
    }

    this.state = {
      data: data
    }

    this.scrollY = new Animated.Value(0);
    this.props.navigation.setParams(makeCollapsibleParams(
      this.scrollY, headerHeight, 'black'));
  }

  componentDidMount(){
    this.subscribe_willFocus = this.props.navigation.addListener('willFocus', (a) => {
      console.log('focus', a);
      // this.props.navigation.setParams(makeCollapsibleParams(
      //   this.scrollY, headerHeight, 'black'));
    });
    this.subscribe_willBlur = this.props.navigation.addListener('willBlur', (a) => {
      console.log('blur', a);
      // this.props.navigation.setParams(null);
    });
  }
  componentWillUnmount(){
    if(this.subscribe_willFocus){
      this.subscribe_willFocus.remove();
      this.subscribe_willFocus = null;
    }
    if(this.subscribe_willBlur){
      this.subscribe_willBlur.remove();
      this.subscribe_willBlur = null;
    }
  }

  renderItem = ({item, index}) => (
    <TouchableOpacity 
      onPress={() => {
        this.props.navigation.navigate('DetailScreen');
      }}
      style={{width: '100%', height: 50, borderBottomColor: '#0002', borderBottomWidth: 0.5, paddingHorizontal: 20, justifyContent: 'center'}}>
      <Text style={{fontSize: 22}}>{item}</Text>
    </TouchableOpacity>
  )

  render(){
    const { navigation } = this.props;

    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 1}} forceInset={{bottom: 'never'}}>
          <AnimatedFlatList 
            style={{flex: 1}}
            contentContainerStyle={{paddingTop: headerHeight}}
            data={this.state.data}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => String(index)}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: this.scrollY}}}],
              {useNativeDriver: true})
            } 
            />
        </SafeAreaView>
        <CollapsibleHeaderBackView navigation={navigation} />
      </View>
    )
  }
}